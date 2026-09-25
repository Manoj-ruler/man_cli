// Spec §4.4 -- Cohen's kappa between the original AI-assigned labels and an independent
// reviewer's blind judgments (research/datasets/independent_review/review_sheet.json, filled in
// AFTER build_independent_review_sample.js, by someone who has not seen
// ANSWER_KEY_do_not_share_with_reviewer.json). Run this only once the reviewer's answers exist.
//
// Mapping: reviewer answer A (single clear command) -> treated as agreeing with original
// AMBIGUOUS==false, OOD==false, i.e. "answerable/not-OOD-not-ambiguous" -- since none of these 59
// sampled queries were originally labeled CORRECT (all are OOD or AMBIGUOUS candidates), an "A"
// answer is a DISAGREEMENT with either original label by construction, which is itself useful
// signal, not an artifact. B -> AMBIGUOUS. C -> OOD.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const reviewDir = path.join(projectRoot, 'research/datasets/independent_review');

const answers = JSON.parse(fs.readFileSync(path.join(reviewDir, 'review_sheet.json'), 'utf-8'));
const key = JSON.parse(fs.readFileSync(path.join(reviewDir, 'ANSWER_KEY_do_not_share_with_reviewer.json'), 'utf-8'));
const keyById = new Map(key.map(k => [k.review_id, k]));

const unanswered = answers.filter(a => !a.answer);
if (unanswered.length > 0) {
  console.error(`FATAL: ${unanswered.length}/${answers.length} items still unanswered (${unanswered.map(a => a.review_id).join(', ')}). Fill in review_sheet.json's "answer" field (A/B/C) for every item before computing kappa.`);
  process.exit(1);
}

function toLabel(answer) {
  const a = String(answer).trim().toUpperCase();
  if (a === 'A') return 'CORRECT_OR_CLEAR';
  if (a === 'B') return 'AMBIGUOUS';
  if (a === 'C') return 'OOD';
  throw new Error(`Invalid answer "${answer}" -- must be A, B, or C`);
}

const rows = answers.map(a => {
  const k = keyById.get(a.review_id);
  return { review_id: a.review_id, original_label: k.original_label, original_id: k.original_id, reviewer_label: toLabel(a.answer), agree: k.original_label === toLabel(a.answer) };
});

// Cohen's kappa over the 3 possible categories present in this sample (OOD, AMBIGUOUS, CORRECT_OR_CLEAR)
const categories = ['OOD', 'AMBIGUOUS', 'CORRECT_OR_CLEAR'];
const n = rows.length;
const po = rows.filter(r => r.agree).length / n; // observed agreement

// expected agreement by chance: sum over categories of (P(original=cat) * P(reviewer=cat))
let pe = 0;
categories.forEach(cat => {
  const pOrig = rows.filter(r => r.original_label === cat).length / n;
  const pRev = rows.filter(r => r.reviewer_label === cat).length / n;
  pe += pOrig * pRev;
});
const kappa = pe < 1 ? (po - pe) / (1 - pe) : (po === 1 ? 1 : 0);

const output = {
  n, observed_agreement: +po.toFixed(4), expected_agreement_by_chance: +pe.toFixed(4), cohens_kappa: +kappa.toFixed(4),
  interpretation: kappa >= 0.7 ? 'MEETS spec §4.4 target (kappa>=0.7)' : 'BELOW spec §4.4 target (kappa>=0.7) -- report as-is, investigate disagreements, do not hide',
  rows, generated_at: new Date().toISOString()
};

fs.writeFileSync(path.join(reviewDir, 'kappa_results.json'), JSON.stringify(output, null, 2), 'utf-8');

console.log(`=== Cohen's Kappa: original v0.2 labels vs. independent blind review (n=${n}) ===`);
console.log(`Observed agreement: ${(po * 100).toFixed(1)}%`);
console.log(`Expected by chance: ${(pe * 100).toFixed(1)}%`);
console.log(`Cohen's kappa: ${kappa.toFixed(4)} -- ${output.interpretation}`);
console.log('\nPer-item:');
rows.forEach(r => console.log(`  ${r.review_id} (${r.original_id}): original=${r.original_label} reviewer=${r.reviewer_label} ${r.agree ? 'AGREE' : 'DISAGREE'}`));
console.log(`\nWrote ${path.join(reviewDir, 'kappa_results.json')}`);
