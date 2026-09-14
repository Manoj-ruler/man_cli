// Benchmark v0.2 -- merge v0.1's 150 queries with the 59 new adjudicated entries (35 OOD + 24
// AMBIGUOUS), producing termassist_bench_v0.2.json/.csv and a corresponding review file. v0.1's
// own files are NEVER modified -- v0.2 is a new, separate, frozen artifact, exactly as v0.1 was
// built without touching production code.
//
// PROVENANCE DISCLOSURE (stated explicitly, not hidden): the new v0.2 queries and their
// adjudication were authored and verified by an AI agent (Claude), under human direction, using
// the SAME documented design/inclusion/exclusion criteria as v0.1 (TERMASSIST_BENCH_DESIGN.md)
// and cross-checked against actual lexical+dense retrieval output rather than judged from
// intuition alone (research/datasets/v0.2_adjudication_raw.json). This is disclosed here and in
// the v0.2 validation report so a reviewer can weigh it appropriately -- v0.1's own queries were
// also agent-generated-then-reviewed (validation_audit.md: "Audit report generated autonomously"),
// so this is a continuation of the same process, not a new methodology.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = path.join(__dirname, '..', '..');
const datasetsDir = path.join(projectRoot, 'research/datasets');

const v01Text = fs.readFileSync(path.join(datasetsDir, 'termassist_bench_v0.1_validated.json'), 'utf-8').replace(/\r\n/g, '\n');
const v01 = JSON.parse(v01Text);
const newEntries = JSON.parse(fs.readFileSync(path.join(datasetsDir, 'v0.2_new_entries.json'), 'utf-8'));
const v01Reviews = JSON.parse(fs.readFileSync(path.join(datasetsDir, 'review/human_review_results.json'), 'utf-8'));

const allNewQueries = [...newEntries.ood, ...newEntries.ambiguous];

const v02 = {
  _meta: {
    name: 'TermAssist-Bench v0.2 (Validated)',
    version: '0.2.0-validated',
    description: 'v0.1 (150 queries) plus a targeted expansion of the OOD (+35) and AMBIGUOUS (+24) subsets, adjudicated against actual lexical+dense retrieval output, per the Phase-17-identified need for more statistical power on the OOD comparison. v0.1 remains frozen and unmodified.',
    created_at: new Date().toISOString(),
    baseline_tag: 'v1.0-research-baseline',
    platform: 'win32',
    corpus_total: 431,
    corpus_filtered: 279,
    total_queries: v01.queries.length + allNewQueries.length,
    parent_benchmark: 'termassist_bench_v0.1-validated',
    parent_benchmark_sha256: '2a554d3c3c425192e0fa295f2dc2eae833f92a2ae77feaf0f3ef70996e8c02a0',
    provenance_disclosure: 'New v0.2 queries (TA-B151 to TA-B209) were authored and adjudicated by an AI agent (Claude) under human direction, verified against actual system retrieval output (see v0.2_ADJUDICATION_REPORT.md), following the identical design/inclusion/exclusion criteria documented in TERMASSIST_BENCH_DESIGN.md for v0.1.',
    annotation_status: 'validated'
  },
  queries: [...v01.queries, ...allNewQueries]
};

const v02Path = path.join(datasetsDir, 'termassist_bench_v0.2_validated.json');
fs.writeFileSync(v02Path, JSON.stringify(v02, null, 2), 'utf-8');

// CSV (same columns as v0.1's CSV)
const csvHeaders = ['id', 'query', 'gold_intent', 'gold_command', 'acceptable_commands', 'category', 'difficulty', 'query_type', 'risk_level', 'known_task', 'ambiguity', 'requires_rejection', 'source_intent_id', 'notes', 'annotation_status'];
function csvEsc(v) {
  if (v === null || v === undefined) return '';
  const s = Array.isArray(v) ? v.join('; ') : String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
const csvRows = [csvHeaders.join(',')];
v02.queries.forEach(q => csvRows.push(csvHeaders.map(h => csvEsc(q[h])).join(',')));
fs.writeFileSync(path.join(datasetsDir, 'termassist_bench_v0.2_validated.csv'), csvRows.join('\n') + '\n', 'utf-8');

// Review file: v0.1's reviews + new reviews for the 59 new entries
const newReviews = allNewQueries.map(q => ({
  id: q.id,
  reviewer: 'Claude (AI agent, under user direction)',
  decision: q.query_type === 'ood' ? 'OOD' : 'AMBIGUOUS',
  final_gold_command: q.gold_command,
  final_acceptable_commands: q.acceptable_commands,
  final_ambiguity: q.ambiguity,
  final_known_task: q.known_task,
  final_risk_level: q.risk_level,
  review_notes: q.notes,
  review_timestamp: new Date().toISOString()
}));
fs.writeFileSync(path.join(datasetsDir, 'review/human_review_results_v0.2.json'), JSON.stringify([...v01Reviews, ...newReviews], null, 2), 'utf-8');

// Hashes (LF-normalized, consistent with the established v0.1 convention -- see Phase 0 audit)
function sha256LF(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(Buffer.from(text, 'utf-8')).digest('hex');
}
const jsonHash = sha256LF(v02Path);
const csvHash = sha256LF(path.join(datasetsDir, 'termassist_bench_v0.2_validated.csv'));

// Classification counts computed from the review decision field (the same source of truth
// reproduce_baseline.js and every downstream script uses via reviewMap.get(id).decision) --
// v0.1's original 119/14/15/2 split, plus the new batch's 0/24/35/0.
const allReviews = [...v01Reviews, ...newReviews];
const reviewById = new Map(allReviews.map(r => [r.id, r]));
const classificationCounts = { CORRECT: 0, AMBIGUOUS: 0, OOD: 0, NEEDS_CORRECTION: 0 };
v02.queries.forEach(q => {
  const decision = reviewById.get(q.id)?.decision || 'CORRECT';
  classificationCounts[decision] = (classificationCounts[decision] || 0) + 1;
});

const manifest = {
  benchmark_name: 'TermAssist-Bench',
  version: 'v0.2-validated',
  total_queries: v02.queries.length,
  correct: classificationCounts.CORRECT,
  ood: classificationCounts.OOD,
  ambiguous: classificationCounts.AMBIGUOUS,
  needs_correction: classificationCounts.NEEDS_CORRECTION,
  platform: 'win32',
  production_code_modified: false,
  parent_benchmark: 'v0.1-validated (unmodified)',
  validation_status: 'frozen',
  validated_json_sha256_lf_normalized: jsonHash,
  validated_csv_sha256_lf_normalized: csvHash,
  created_at: new Date().toISOString(),
  provenance_disclosure: v02._meta.provenance_disclosure,
  adjudication_report_path: 'research/datasets/v0.2_ADJUDICATION_REPORT.md'
};
fs.writeFileSync(path.join(datasetsDir, 'VALIDATED_BENCHMARK_MANIFEST_v0.2.json'), JSON.stringify(manifest, null, 2), 'utf-8');

console.log('=== BENCHMARK v0.2 FROZEN ===');
console.log('Total queries:', v02.queries.length);
console.log('OOD:', v02.queries.filter(q => q.query_type === 'ood').length);
console.log('Ambiguous (ambiguity=true):', v02.queries.filter(q => q.ambiguity).length);
console.log('JSON SHA-256 (LF-normalized):', jsonHash);
console.log('CSV SHA-256 (LF-normalized):', csvHash);
console.log('Wrote:', v02Path);
