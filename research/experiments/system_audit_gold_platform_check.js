// RESEARCH-01 (research/task_plan/TASK_BACKLOG.md): how many benchmark items accept a command that
// cannot run in Windows PowerShell, and how many shipped answers were counted correct although the
// returned command is POSIX-only? Read-only over frozen files; writes a NEW output only.
//
// Heuristic (stated in the output): a command is POSIX-only if it invokes a tool that neither exists
// on Windows nor is a PowerShell alias. PowerShell aliases (ls, cat, ps, kill, cp, mv, rm, echo, pwd,
// cd, man, curl on older builds) and tools shipped with Windows 10+ (tar, ssh, ssh-keygen, curl.exe)
// are NOT flagged. The list is a lower-bound heuristic; every flagged item is listed for checking.
// It changes no label and re-scores nothing: the benchmark's own statuses are reported as they are.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..');
const rel = p => path.join(ROOT, p);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(rel(p))).digest('hex');

const POSIX_ONLY = /(^|[\s|;&(])(sudo|apt|apt-get|yum|dnf|brew|systemctl|systemd-resolve|chmod|chown|killall|grep|awk|sed|xargs|crontab|tmux|lsof|ifconfig|reboot)\b|\/etc\/|\/dev\//;
const isPosix = c => POSIX_ONLY.test(c || '');

const VERS = {
  'v0.1': { bench: 'research/datasets/termassist_bench_v0.1_validated.json', review: 'research/datasets/review/human_review_results.json', repro: 'research/results/baseline/reproduction-results.json' },
  'v0.2': { bench: 'research/datasets/termassist_bench_v0.2_validated.json', review: 'research/datasets/review/human_review_results_v0.2.json', repro: 'research/results/v0.2/reproduction-results.json' }
};
const inputs = {}, out = {};
for (const [v, P] of Object.entries(VERS)) {
  Object.values(P).forEach(p => { inputs[p] = sha(p); });
  const qs = JSON.parse(fs.readFileSync(rel(P.bench), 'utf8')).queries;
  const rv = new Map(JSON.parse(fs.readFileSync(rel(P.review), 'utf8')).map(r => [r.id, r]));
  const rp = new Map(JSON.parse(fs.readFileSync(rel(P.repro), 'utf8')).map(r => [r.id, r]));
  const items = qs.map(q => {
    const r = rv.get(q.id);
    const valid = [q.gold_command || (r ? r.final_gold_command : null), ...(q.acceptable_commands || [])].filter(Boolean);
    const got = rp.get(q.id);
    return { id: q.id, query: q.query, valid, posixValid: valid.filter(isPosix), status: got.evaluation.status, returned: got.actual.command, confidence: got.actual.confidence };
  });
  const anyPosix = items.filter(x => x.posixValid.length > 0);
  const allPosix = items.filter(x => x.valid.length > 0 && x.posixValid.length === x.valid.length);
  const creditedPosix = items.filter(x => ['CORRECT', 'AMBIGUOUS_CORRECT'].includes(x.status) && isPosix(x.returned));
  out[v] = {
    n_items: items.length,
    items_accepting_a_posix_only_command: anyPosix.map(x => ({ id: x.id, query: x.query, posix_valid: x.posixValid })),
    items_whose_every_accepted_command_is_posix_only: allPosix.map(x => x.id),
    shipped_answers_credited_correct_but_posix_only: creditedPosix.map(x => ({ id: x.id, query: x.query, returned: x.returned, status: x.status, confidence: x.confidence }))
  };
}
const OUT = rel('research/results/system_audit');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'gold_platform_check.json'), JSON.stringify({
  task: 'RESEARCH-01: platform-inconsistent accepted commands in the Windows benchmark (read-only)',
  heuristic_regex: POSIX_ONLY.source,
  note: 'Lower-bound heuristic; labels are unchanged and nothing is re-scored.',
  input_sha256: inputs, versions: out, generated_at: new Date().toISOString()
}, null, 2));
for (const [v, R] of Object.entries(out)) console.log(`${v}: ${R.items_accepting_a_posix_only_command.length} items accept a POSIX-only command (${R.items_whose_every_accepted_command_is_posix_only.length} accept only such commands); ${R.shipped_answers_credited_correct_but_posix_only.length} shipped answers credited correct are POSIX-only: ${R.shipped_answers_credited_correct_but_posix_only.map(x => x.id + ' `' + x.returned + '`').join('; ')}`);
