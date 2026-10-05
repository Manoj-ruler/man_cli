# Draft: annotator facts D1–D5 in the paper and the checklist (FINAL-06)

**Status: DRAFT for author approval. Nothing in the paper or the checklist is changed.**

## The author's answers (2026-10-05)

| Item | Answer |
|---|---|
| D1 recruitment | The two annotators are friends of the author and named members of the project team. They did no work on the tool, the benchmark or the paper before annotating. |
| D1 pay | Unpaid volunteers. |
| D2 consent | Yes: they agreed to their labels being used and reported. |
| D3 ethics review | None. No ethics board reviewed the annotation. |
| D4 demographics | Not collected. |
| D5 instructions | The codebook and the annotator guidelines are released with the benchmark. They are already committed in the repository. |
| First reviewer (κ = 0.63 check) | The same answers: unpaid, consented, no ethics review, no demographics collected. |

**Protocol check.** `ANNOTATION_PROTOCOL.md` §2 requires "two people with no prior involvement in the
benchmark or paper (not the author, not the project director who did the first review)". By the author's
account, both annotators meet this. The paper should still say that they are team members and friends, and
so not external annotators.

## Proposed text

### 1. §3 (body; about +1 line)

Current: `Two annotators, who both confirmed working independently and were not shown the original labels,
labeled`

Proposed:

```latex
Two annotators from our project team, who had not worked on the tool, the benchmark or this paper, both confirmed
working independently and were not shown the original labels; they labeled
```

### 2. Limitations, benchmark bullet

Current: `blinding and independence rest on the annotators' own compliance, as the repository is public;`

Proposed:

```latex
the annotators are friends of the author and members of the project team, not external annotators, and blinding
and independence rest on their own compliance, as the repository is public;
```

### 3. Ethical Considerations (after "…were written by an AI assistant.")

```latex
The first reviewer and the two annotators are unpaid volunteers who agreed to their labels being used and
reported; the two annotators are friends of the author and members of the project team who did no work on the tool,
the benchmark or this paper. They labeled requests and are not data subjects; we collected no demographic data,
and no ethics board reviewed the annotation. The codebook and the annotator guidelines are released with the
benchmark.
```

### 4. Appendix D, Protocol paragraph (appended)

```latex
Both annotators are unpaid members of our project team and friends of the author; neither had worked on the tool,
the benchmark or this paper, which the protocol requires.
```

### 5. Responsible NLP checklist, section D

- **D1 (instructions given to participants):** Yes. The codebook and annotator guidelines are released with
  the benchmark (Ethics; Appendix D).
- **D2 (recruitment and pay):** Yes, reported. Unpaid volunteers; friends of the author and members of the
  project team (Ethics; Limitations).
- **D3 (consent):** Yes. They agreed to their labels being used and reported (Ethics).
- **D4 (ethics review):** No. No ethics board reviewed the annotation; the paper says so (Ethics). The
  annotators labeled requests and are not data subjects.
- **D5 (demographics):** No. None were collected; the paper says so (Ethics).

## Notes

- **No new number enters the paper,** so the claim trace needs no new entry. The Limitations and Ethics
  coverage check still runs.
- **Anonymity:** no name, institution or location is added. "Friends of the author" and "project team" do
  not identify anyone.
- **Not stated in the draft:** the first reviewer's role ("project director", from the protocol). The paper
  keeps "one partially independent reviewer". Say so if you want the role named.
