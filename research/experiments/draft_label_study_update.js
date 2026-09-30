// Drafts the paper update for the two-annotator label study, from its result files. It proposes
// text; it never edits the paper.
//
//   node research/experiments/draft_label_study_update.js
//       reads  research/results/annotation/annotation_results.json and relabel_proposal.json
//       writes research/paper/drafts/LABEL_STUDY_UPDATE_DRAFT.md
//   add --results <annotation_results.json> --out <file> --allow-synthetic   for test fixtures
//
// For each passage of content.tex that reports the label check (abstract, §3 benchmark, conclusion,
// limitations, ethics) it prints the CURRENT text and a PROPOSED replacement:
//   - every number is read from the result files, never typed;
//   - the wording branch is chosen from the pre-declared criteria (protocol §4):
//       BOTH_MET (κ ≥ 0.70 and ≥ 90% of OOD labels confirmed), KAPPA_ONLY, NOT_MET.
// It also prints the trace_claims.js registrations for the new numbers and the abstract word count
// (ACL limit 200).
//
// What it cannot decide, and flags for the author:
//   - whether "independently" may be written (gate G0: both annotators confirmed they worked alone
//     and without AI tools);
//   - how the paper reports v0.2 vs v0.2.1 results (a separate step after run_v0_2_1.js).
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const arg = k => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : null);
const resultsFile = path.resolve(ROOT, arg('--results') || 'research/results/annotation/annotation_results.json');
const outFile = path.resolve(ROOT, arg('--out') || 'research/paper/drafts/LABEL_STUDY_UPDATE_DRAFT.md');
const A = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
if (A.stamp && !process.argv.includes('--allow-synthetic')) { console.error('ABORT: results are stamped ' + A.stamp); process.exit(1); }
if (A.stamp && path.relative(path.join(ROOT, 'research'), outFile).split(path.sep)[0] !== '..') { console.error('ABORT: a synthetic draft must be written outside research/'); process.exit(1); }
const propFile = path.join(path.dirname(resultsFile), 'relabel_proposal.json');
const prop = fs.existsSync(propFile) ? JSON.parse(fs.readFileSync(propFile, 'utf8')) : null;
const tex = fs.readFileSync(path.join(ROOT, 'research/paper/acl_latex/content.tex'), 'utf8').replace(/\r\n/g, '\n');

const f2 = x => (+x).toFixed(2);
const k = A.primary, cr = A.criteria, ood = A.outcomes_targets.ood_confirmation;
const K = f2(k.kappa), LO = f2(k.ci95[0]), HI = f2(k.ci95[1]);
const branch = A.all_pre_declared_criteria_met ? 'BOTH_MET' : cr.kappa_ge_0_70.met ? 'KAPPA_ONLY' : 'NOT_MET';
const nRelabel = prop ? prop.relabel.length : null;
const adj = A.adjudication;

// passages: [name, exact current text (must occur once in content.tex), proposed text]
const target = branch === 'NOT_MET' ? 'below' : 'above';
const oodClause = `both annotators kept the original label for ${ood.both_agree_with_original} of ${ood.n} out-of-scope queries`;
const critClause = branch === 'BOTH_MET' ? 'meeting both pre-declared criteria'
  : branch === 'KAPPA_ONLY' ? `short of the pre-declared 90\\% out-of-scope criterion`
  : 'below the pre-declared criteria';
const adjClause = adj ? `; a third reader adjudicated the ${adj.n_items - adj.n_decoys} disputed items, blind to the original labels and mixed with ${adj.n_decoys} decoys` : '; no third reader was available, so disputed items were excluded';
const NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const relabelClause = nRelabel == null ? '' : ` ${nRelabel === 0 ? 'No label changed.' : `${NUM[nRelabel] || nRelabel} label${nRelabel > 1 ? 's' : ''} changed, giving benchmark v0.2.1 (\\S\\ref{sec:system}).`}`;
const P = [
  ['Abstract (last sentence)',
    'All analyses are exploratory; a two-annotator study is under way.',
    branch === 'NOT_MET' ? `All analyses are exploratory; annotator agreement fell below target ($\\kappa=${K}$).`
      : `All analyses are exploratory; two annotators' labels agree at $\\kappa=${K}$.`],
  ['§3 Benchmark: the label check',
    `One partially independent reviewer, shown only the query text, re-labeled a
stratified sample of 14 AI-authored queries: Cohen's $\\kappa=0.63$ \\citep{cohen1960coefficient} (post hoc bootstrap
95\\% interval [0.39, 1.00]), below our 0.7 target. The reviewer agreed with all 8 out-of-scope labels (exact 95\\%
interval for the agreement rate [63, 100]\\%; 7 everyday requests and one far-from-corpus computing task, none a
terminal task) and disagreed on 3 of 6 ambiguous ones. A two-annotator study with a written codebook is under way.`,
    `Two annotators, [G0: write "working independently" only if both confirmed it] from a written codebook and shown only the query text, re-labeled the AI-authored queries and 20 controls: Cohen's $\\kappa=${K}$ \\citep{cohen1960coefficient} (95\\% bootstrap interval [${LO}, ${HI}], ${k.n} items, ${k.percent_agreement}\\% agreement), ${target} our pre-declared 0.7 target; ${oodClause}, ${critClause}${adjClause}.${relabelClause} An earlier check by one partially independent reviewer ($n=14$) gave $\\kappa=0.63$.`],
  ['§7 Conclusion: next steps',
    'finish the two-annotator label study and release a corrected benchmark;',
    'release the corrected benchmark;'],
  ['Limitations: benchmark bullet',
    `59 queries drafted by an AI agent, whose labels were checked only by one partially independent reviewer
  ($\\kappa=0.63$, interval [0.39, 1.00], $n=14$); the two-annotator study has no results yet.`,
    `59 queries drafted by an AI agent, whose labels two annotators re-labeled with $\\kappa=${K}$ (interval [${LO}, ${HI}]; ${critClause}).`],
  ['Ethics',
    'and that our own label check fell below target.',
    branch === 'NOT_MET' ? `and that agreement between our two annotators ($\\kappa=${K}$) fell below target.` : `and report the agreement of our two annotators ($\\kappa=${K}$).`]
];

const words = s => s.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1').replace(/[$\\{}]/g, '').split(/\s+/).filter(Boolean).length;
const abs = (tex.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/) || [])[1] || '';
const absNew = abs.replace(P[0][1], P[0][2]);

const md = [];
md.push('# Draft: paper update for the two-annotator label study', '');
md.push(`**Generated by** \`research/experiments/draft_label_study_update.js\` from \`${path.relative(ROOT, resultsFile).split(path.sep).join('/')}\`${A.stamp ? ` — **${A.stamp}**` : ''}. It proposes text; it edits nothing.`, '');
md.push(`**Outcome branch:** \`${branch}\`. The pre-declared criteria were κ ≥ 0.70 (κ = ${K}, ${cr.kappa_ge_0_70.met ? 'met' : 'not met'}) and ≥ 90% of OOD labels confirmed (${ood.both_agree_with_original}/${ood.n}, ${cr.ood_confirmed_ge_90pct.met ? 'met' : 'not met'}).`, '');
md.push('**Before applying:**', '');
md.push('1. Settle the bracketed G0 note in §3: write "working independently" only if both annotators confirmed it.');
md.push('2. Apply the passages below, then update the v0.2 numbers from the v0.2.1 re-run (`run_v0_2_1.js`). That is a separate step; how v0.2 and v0.2.1 are reported side by side is the author\'s decision.');
md.push(`3. Abstract: ${words(abs)} words now, ${words(absNew)} after this change (ACL limit 200).`);
if (!A.all_pre_declared_criteria_met) md.push('   **Criteria not both met.** Per protocol §4 (fixed in advance), report as measured, and drop ambiguity detection from the headline. At most one codebook revision is allowed, evaluated only on new items. Check every sentence that relies on the ambiguous labels.');
md.push('4. Register the new numbers in `trace_claims.js` (block at the end), then run it (0 problems) and `bash build.sh` (≤ 8 pages).', '');
P.forEach(([name, cur, neu], i) => {
  const n = tex.split(cur).length - 1;
  md.push(`## ${i + 1}. ${name}`, '');
  md.push(n === 1 ? '*Found once in `content.tex`.*' : `**WARNING: the current text occurs ${n} times in content.tex; the paper changed since this drafter was written; locate the passage by hand.**`, '');
  md.push('**Current:**', '', '```latex', cur, '```', '', '**Proposed:**', '', '```latex', neu, '```', '');
});
md.push('## trace_claims.js registrations', '');
md.push('Add to `research/experiments/trace_claims.js` (same form as the existing blocks):', '', '```js');
md.push(`// two-annotator label study (research/results/annotation/annotation_results.json)`);
md.push(`{ const A = require(rel('research/results/annotation/annotation_results.json'));`);
md.push(`  check('kappa', A.primary.kappa, ${K}); check('kappa lo', A.primary.ci95[0], ${LO}); check('kappa hi', A.primary.ci95[1], ${HI});`);
md.push(`  check('items', A.primary.n, ${k.n}); check('agreement %', A.primary.percent_agreement, ${k.percent_agreement});`);
md.push(`  check('OOD kept', A.outcomes_targets.ood_confirmation.both_agree_with_original, ${ood.both_agree_with_original}); check('OOD n', A.outcomes_targets.ood_confirmation.n, ${ood.n}); }`);
md.push('```', '', 'Adapt `check(...)` to the helper names used in trace_claims.js.');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, md.join('\n') + '\n');
console.log(`wrote ${path.relative(ROOT, outFile)}: branch ${branch}, κ = ${K} [${LO}, ${HI}], abstract ${words(abs)} -> ${words(absNew)} words; passages found once: ${P.filter(([, c]) => tex.split(c).length === 2).length}/${P.length}`);
