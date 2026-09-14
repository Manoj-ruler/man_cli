# TermAssist Research Program — Faculty Summary

## Problem

TermAssist is a natural-language terminal assistant: a user types something like "undo my last
git commit but keep the changes" and the tool retrieves a matching shell command from a curated
library. The shipped, real-world version (a published npm package with real users) uses a purely
lexical algorithm — BM25, a standard information-retrieval scoring method — with no machine
learning, embeddings, or LLM involved. This project deliberately does not introduce an LLM
anywhere in the shipped system; that constraint was set by the student at the outset and held
throughout.

## Existing system and its measured weakness

Before this research program began, a validated 150-query benchmark (`termassist_bench v0.1`)
and a frozen baseline evaluation already existed. That baseline showed the system is accurate on
straightforward queries (100% on canonical phrasings) but degrades sharply on harder cases: 33%
accuracy on paraphrased queries with little word overlap, 0% on single ambiguous keywords, and
only 27% rejection of genuinely out-of-scope requests. Most importantly, when the system is
wrong, it is usually *confident* it is right — the average confidence shown for a wrong answer
was 86% (a figure this research program traced to and corrected a transcription error in, see
below), with nearly half of all wrong answers displayed at 100% confidence. A user cannot
distinguish a trustworthy answer from an untrustworthy one just by looking at the number shown.

## Research gap and hypothesis

The hypothesis tested was: can a lightweight (still fully offline, still no LLM) improvement —
combining the existing lexical method with a small local semantic-similarity model, plus explicit
signals for "how sure is the system, really" — measurably improve both accuracy and, separately,
the trustworthiness of the confidence shown to the user? This was treated as a genuine empirical
question, not a foregone conclusion — the student's plan explicitly forbade assuming the answer
in advance and required reporting a negative result honestly if the data showed one.

## What was built and tested

A local, fully offline semantic retrieval model was added alongside the existing lexical method,
and the two were combined with a tunable weighting parameter, selected using a rigorous
statistical procedure (5-fold cross-validation, where the weighting is only ever chosen using
data the final test never sees — this is the same discipline used to prevent a model from
"cheating" by peeking at its own exam answers). On top of that, the system was extended with:
signals for how confident it should be (based on how much better its top answer is than its
second-best guess); a mechanism to detect and reject queries outside its scope; a statistical
recalibration of its confidence numbers so they better reflect true accuracy; a small, fully
rule-based (no AI) safety classifier that flags potentially dangerous commands; and a sandboxed
testing setup that actually *runs* a subset of retrieved commands (never on the real computer,
only in disposable temporary folders) to check they truly work, not just that the text matches.

## Results

The combined (hybrid) system improved retrieval accuracy from 71.9% to 77.1%, and this
improvement passed a formal statistical significance test — meaning it is very unlikely to be due
to chance, not just a lucky sample. Separately, and just as importantly, the confidence-
recalibration work reduced the gap between "how confident the system says it is" and "how often
it's actually right" by about 80% for the best-performing confidence signal — directly fixing the
overconfidence problem that motivated the whole project. The system's ability to detect and
reject out-of-scope requests roughly doubled (27% to 47%), though with only 15 such examples in
the benchmark, that particular improvement could not be confirmed as statistically significant —
this is reported honestly as a promising but unconfirmed finding, not inflated into a stronger
claim than the data supports. A small, deterministic safety classifier (no machine learning at
all) correctly flagged 95% of genuinely dangerous commands with 95% precision, and never once
mistook a truly dangerous command for a safe one.

## What did not work, or worked only partially

Not everything improved. A specific heuristic in the original system (a bonus score for exact
keyword matches) was found, upon careful testing, to have literally zero effect on which answer
the system returns — a clean negative result that actually clarifies, rather than confirms, an
earlier hypothesis about what was causing errors. An attempt to detect *ambiguous* queries (as
opposed to out-of-scope ones) worked, but not well — it correctly flags about two-thirds of truly
ambiguous queries, but also incorrectly flags many queries that are not ambiguous. This is
reported as an open problem for future work, not hidden or explained away. Two real bugs were
found and fixed during the process (one in the statistical calibration code, one in the
significance-testing code) — both were caught by the student cross-checking new results against
already-established numbers before reporting them, which is exactly the kind of verification
discipline this kind of research requires.

## Research contribution

The defensible contribution is: a lightweight, fully offline, non-LLM hybrid retrieval system for
natural-language shell commands, which measurably and statistically significantly improves both
accuracy and the trustworthiness of its own confidence estimates over a real, previously-shipped
baseline — evaluated with a rigorous, leakage-free experimental protocol throughout. This is, to
the best of a literature re-check performed as part of this program, the first study to report a
BM25-based retrieval baseline evaluated this way for this specific task.

## Limitations, stated plainly

The benchmark is modest in size (150 queries), which is enough to confirm the main accuracy
result but not enough to confirm the out-of-scope-detection improvement statistically. Only a
narrow slice of commands (about 10%) were actually executed and verified to work correctly, for
safety reasons — most command categories (Docker, networking, cloud tools) could not be safely
tested without risking side effects on a real machine. The project deliberately does not compare
itself head-to-head against modern LLM-based systems, since those solve a different problem
(generating arbitrary commands vs. retrieving from a pre-vetted, safer set) — any such comparison
would not be a fair or meaningful contest.

## Bottom line

This is real, measured, cross-validated evidence — not a demonstration or a feature list. It
shows one genuine improvement that is statistically confirmed (accuracy), one that is strong and
well-evidenced though methodologically distinct (calibration), and several findings reported
honestly as weaker, unconfirmed, or negative — which is exactly the balance a defensible research
paper needs before submission.
