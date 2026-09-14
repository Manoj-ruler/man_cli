// Benchmark v0.2 -- construct new OOD and AMBIGUOUS entries from the adjudicated candidates.
// Every acceptance/rejection decision below was made by inspecting the actual lexical+dense
// retrieval output (research/datasets/v0.2_adjudication_raw.json), following v0.1's documented
// criteria (TERMASSIST_BENCH_DESIGN.md sections 3-4, 7-8) -- not accepted wholesale.
//
// REJECTED from the drafted ambiguous candidates, with reasons (documented, not silently dropped):
//   "tar"                 -> ACCEPTED (see note: reveals a genuine tar.gz tokenization gap)
//   "compress a folder"   -> REJECTED: one dominant, unambiguous answer (Compress-Archive); others score 0/irrelevant
//   "restart a service"   -> REJECTED: Restart-Service is the clear single answer; "sudo reboot" is a different task (whole machine, not "a service")
//   "check git history"   -> REJECTED: near-duplicate of existing v0.1 query "view the git log" (exclusion criterion 5)
//   "extract an archive"  -> REJECTED: one dominant answer; "alternatives" are the opposite operation (compress) or a dry-run flag of the same command
//   "convert a video file"-> REJECTED: one clearest reading (transcode); redundant with the already-accepted "ffmpeg" bare-keyword case
//   "kill a process"      -> REJECTED: Stop-Process -Id/-Name are the same command with different parameters, not distinct tasks; tmux alternative is a large score gap away

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');

const raw = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/datasets/v0.2_adjudication_raw.json'), 'utf-8'));
const rawOodByQuery = new Map(raw.ood.map(r => [r.query, r]));

let nextId = 151;
function newId() { return `TA-B${String(nextId++).padStart(3, '0')}`; }

// --- OOD entries: difficulty = 'easy' if lexical score is 0 AND dense sim < 0.20, else 'hard' ---
// (a simple, stated, non-arbitrary rule matching v0.1's "easy: obviously non-technical, trivially
// rejected; hard: plausible terminal-adjacent, difficult to reject" definition)
const oodQueries = [
  "recommend me a good recipe for dinner", "tell me a joke", "what's the weather like today",
  "help me write a poem about the ocean", "calculate my monthly budget", "find me a good doctor nearby",
  "book a hotel room in Paris", "order a pizza for delivery", "teach me how to play guitar",
  "give me legal advice about my lease", "help me meditate for stress relief", "plan a birthday party for my friend",
  "write my resume for a software job", "give me stock market predictions", "help me learn Spanish",
  "draw a picture of a cat", "compose a song in the style of jazz", "give me a tarot card reading",
  "interpret my dream about flying", "recommend a good movie to watch tonight", "help me train for a marathon",
  "diagnose why my car won't start", "water my garden automatically", "assemble my new bookshelf furniture",
  "bake a chocolate cake", "brew a batch of homemade beer", "mine cryptocurrency on my GPU",
  "model a 3D character in Blender", "mod my video game with custom skins", "schedule a therapy appointment",
  "get my horoscope for today", "write a cover letter for a job application", "plan my wedding seating chart",
  "choose a paint color for my bedroom", "find a babysitter for Friday night"
];

const oodEntries = oodQueries.map(q => {
  const r = rawOodByQuery.get(q);
  const lexScore = r.lexical_top5[0].score;
  const denseSim = r.dense_top5[0].sim;
  const difficulty = (lexScore === 0 && denseSim < 0.20) ? 'easy' : 'hard';
  return {
    id: newId(), query: q, gold_intent: null, gold_command: null, acceptable_commands: [],
    category: null, difficulty, query_type: 'ood', risk_level: 'low', known_task: false,
    ambiguity: false, requires_rejection: true, source_intent_id: null,
    notes: `v0.2 addition. Verified OOD: top lexical score ${lexScore.toFixed(2)}, top dense similarity ${denseSim.toFixed(4)} (both well below confident-match range; canonical matches score 40+, dense correct-match mean ~0.98). ${difficulty === 'hard' ? 'Classified hard: incidental lexical/semantic overlap with an unrelated corpus command makes this non-trivial to reject.' : 'Classified easy: negligible overlap with any corpus command.'}`,
    annotation_status: 'verified'
  };
});

// --- AMBIGUOUS entries: gold_command = most canonical/likely interpretation, acceptable_commands
// = other genuinely distinct valid interpretations (deduplicated of near-identical parameter
// variants, per the rejection reasoning above) ---
const ambiguousEntries = [
  { query: 'grep', category: 'grep', gold: "Select-String -Path 'file.txt' -Pattern 'pattern1|pattern2'", alts: ["Get-ChildItem -Recurse -File | Where-Object { Select-String -Path $_.FullName -Pattern 'pattern' -Quiet }", "Get-Content 'file.txt' | Where-Object { $_ -notmatch 'pattern' }"], risk: 'low', note: 'search a file vs recursive search vs inverse-match filter are genuinely distinct grep-family tasks' },
  { query: 'tar', category: 'tar', gold: 'tar -xzf archive.tar.gz', alts: ['tar -czf archive.tar.gz directory/', 'tar -tzf archive.tar.gz', 'tar -cf archive.tar directory/'], risk: 'medium', note: 'extract vs compress vs list vs create-uncompressed are genuinely distinct tar operations. Adversarial case: bare "tar" fails to lexically surface these via BM25 because intents containing "tar.gz" tokenize into a single merged "targz" token (punctuation-stripping tokenizer bug/limitation), not because the commands do not exist -- a genuine, documented lexical-gap finding, not a forced inclusion.' },
  { query: 'sed', category: 'sed', gold: "(Get-Content 'filename.txt') -replace 'old','new' | Set-Content 'filename.txt'", alts: ["(Get-Content 'filename.txt')[4]", "Get-Content 'filename.txt' | Where-Object { $_ -notmatch 'pattern' } | Set-Content 'filename.txt'"], risk: 'medium', note: 'replace-text vs extract-line vs delete-matching-lines are genuinely distinct sed-family tasks' },
  { query: 'awk', category: 'awk', gold: "Import-Csv 'file.csv' | Select-Object -ExpandProperty ColumnName", alts: ["(Import-Csv 'file.txt' -Header Val | Measure-Object -Property Val -Sum).Sum", "Get-Content 'file.txt' | ForEach-Object { ($_ -split '\\s+').Count }"], risk: 'low', note: 'extract column vs sum column vs count words per line are genuinely distinct awk-family tasks' },
  { query: 'jq', category: 'jq', gold: '(Get-Content data.json | ConvertFrom-Json).users.Count', alts: ['Get-Content data.json | ConvertFrom-Json | Select-Object -ExpandProperty users | Select-Object -ExpandProperty name'], risk: 'low', note: 'count array elements vs extract nested field are genuinely distinct jq-family tasks' },
  { query: 'ffmpeg', category: 'ffmpeg', gold: 'ffmpeg -i input.mkv -c:v libx264 -crf 23 -c:a aac output.mp4', alts: ['ffmpeg -i input.mp4 -ss 00:01:00 -to 00:02:30 -c copy trimmed.mp4', "ffmpeg -i input.mp4 -vf \"fps=10,scale=640:-1\" -loop 0 output.gif"], risk: 'low', note: 'transcode vs trim vs convert-to-gif are genuinely distinct ffmpeg tasks' },
  { query: 'aws', category: 'aws', gold: 'aws s3 ls', alts: ["aws ec2 describe-instances --instance-ids i-1234567890abcdef0 --query 'Reservations[0].Instances[0].PublicIpAddress' --output text", 'aws s3 sync ./local-dir s3://my-bucket/prefix/ --delete'], risk: 'medium', note: 'S3 listing vs EC2 instance query vs S3 sync are genuinely distinct AWS services/operations. System heavily favors "aws s3 ls" by raw score (21.0 vs 3.7) despite the query being genuinely ambiguous by definition -- a good overmatching test case, similar in spirit to the existing "git"/"docker" bare-keyword ambiguous queries.' },
  { query: 'disk', category: 'disk', gold: "Get-PSDrive -PSProvider FileSystem", alts: ["(Get-ChildItem '/path/to/dir' -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB"], risk: 'low', note: 'list drives/volumes vs compute a specific folder\'s size are genuinely distinct disk-related tasks' },
  { query: 'system', category: 'system', gold: 'Get-EventLog -LogName System -Newest 50', alts: ['sudo reboot'], risk: 'high', note: 'view system event logs vs reboot the system are genuinely distinct, high-stakes-difference interpretations' },
  { query: 'shell', category: 'shell', gold: "kubectl exec -it pod-name -n namespace -- /bin/sh", alts: ["Set-Alias -Name ll -Value Get-ChildItem", "$env:VAR_NAME"], risk: 'medium', note: 'open an interactive shell in a container vs shell configuration (alias/env var) are genuinely distinct interpretations' },
  { query: 'terminal', category: 'terminal', gold: 'Clear-Host', alts: ['tmux attach -t session-name', 'screen -r session-name'], risk: 'low', note: 'clear the terminal display vs re-attach to a terminal multiplexer session are genuinely distinct interpretations' },
  { query: 'package', category: 'package', gold: 'winget install package-name', alts: ['winget uninstall package-name', 'winget uninstall package-name --purge'], risk: 'medium', note: 'install vs uninstall vs purge-uninstall are genuinely opposite/distinct package operations' },
  { query: 'security', category: 'security', gold: 'gpg -c filename.txt', alts: ['gpg -d filename.txt.gpg', 'openssl rand -base64 32'], risk: 'medium', note: 'encrypt vs decrypt a file vs generate a random key are genuinely distinct security tasks' },
  { query: 'encoding', category: 'encoding', gold: "[Convert]::ToBase64String([IO.File]::ReadAllBytes('filename.txt'))", alts: ["[IO.File]::WriteAllBytes('decoded.txt', [Convert]::FromBase64String((Get-Content 'encoded.txt')))"], risk: 'low', note: 'encode vs decode base64 are genuinely opposite interpretations' },
  { query: 'archive', category: 'archive', gold: "Compress-Archive -Path 'directory/*' -DestinationPath 'archive.zip'", alts: ["Expand-Archive -Path 'archive.zip' -DestinationPath '.'"], risk: 'medium', note: 'compress vs extract are genuinely opposite archive operations' },
  { query: 'pip', category: 'pip', gold: 'pip install package-name', alts: ['pip uninstall package-name', 'pip freeze > requirements.txt'], risk: 'medium', note: 'install vs uninstall vs list-installed are genuinely distinct pip tasks' },
  { query: 'find', category: 'find', gold: "Get-ChildItem -Recurse -Filter '*.log'", alts: ["Get-ChildItem -Recurse -File | Where-Object { $_.Length -gt 100MB }", "Get-ChildItem -Recurse -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }"], risk: 'low', note: 'find by extension vs find by size vs find by recency are genuinely distinct find tasks, even though implemented via the same underlying cmdlet family' },
  { query: 'stop a process', category: 'process', gold: "Stop-Process -Name 'process_name' -Force", alts: ["Stop-Service -Name 'service-name'", 'docker stop $(docker ps -q)'], risk: 'high', note: 'stop an OS process vs a Windows service vs all docker containers are genuinely distinct scopes for "a process"' },
  { query: 'check disk usage', category: 'disk', gold: "(Get-ChildItem '/path/to/dir' -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB", alts: ['docker system df'], risk: 'low', note: 'host filesystem usage vs docker-specific disk usage are genuinely distinct scopes' },
  { query: 'search for a file', category: 'find', gold: "Get-ChildItem -Recurse -Filter 'filename.txt'", alts: ["Get-ChildItem -Recurse -File | Select-String -Pattern 'pattern' -CaseSensitive:$false", 'winget search package-name'], risk: 'low', note: 'search by filename vs search file contents vs search installable packages are genuinely distinct interpretations of "search for a file"-adjacent phrasing' },
  { query: 'list running processes', category: 'process', gold: 'Get-Process', alts: ['docker ps', 'kubectl get pods --all-namespaces'], risk: 'low', note: 'OS processes vs docker containers vs kubernetes pods are genuinely distinct scopes for "running processes"' },
  { query: 'check network connection', category: 'network', gold: 'Test-Connection -ComputerName google.com -Count 4', alts: ['Get-NetIPAddress', 'Resolve-DnsName example.com'], risk: 'low', note: 'ping test vs view local IP config vs DNS resolution are genuinely distinct network-check tasks' },
  { query: 'install a package', category: 'package', gold: 'winget install package-name', alts: ['pip install package-name', 'npm install package-name'], risk: 'medium', note: 'system package manager vs Python vs npm are genuinely distinct ecosystems, despite winget scoring far higher by raw BM25 (25.0 vs ~9-10) -- a real overmatching test case' },
  { query: 'copy a file', category: 'filesystem', gold: "Copy-Item -Recurse 'source/' 'destination/'", alts: ['scp file.txt user@hostname:/path/to/destination', 'docker cp container-name:/path/in/container ./local-path'], risk: 'low', note: 'local copy vs remote (scp) copy vs docker container copy are genuinely distinct scopes' }
];

const ambiguousFullEntries = ambiguousEntries.map(a => ({
  id: newId(), query: a.query, gold_intent: null, gold_command: a.gold, acceptable_commands: a.alts,
  category: a.category, difficulty: 'hard', query_type: 'ambiguous', risk_level: a.risk, known_task: true,
  ambiguity: true, requires_rejection: false, source_intent_id: null,
  notes: `v0.2 addition. ${a.note}`, annotation_status: 'verified'
}));

const output = { ood: oodEntries, ambiguous: ambiguousFullEntries };
fs.writeFileSync(path.join(projectRoot, 'research/datasets/v0.2_new_entries.json'), JSON.stringify(output, null, 2), 'utf-8');
console.log(`Built ${oodEntries.length} new OOD entries and ${ambiguousFullEntries.length} new AMBIGUOUS entries.`);
console.log(`OOD difficulty split: easy=${oodEntries.filter(e=>e.difficulty==='easy').length}, hard=${oodEntries.filter(e=>e.difficulty==='hard').length}`);
console.log(`Next available ID after this batch: TA-B${String(nextId).padStart(3,'0')}`);
