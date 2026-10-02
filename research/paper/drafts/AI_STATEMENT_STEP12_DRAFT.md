# Draft: AI-use statement update after the label-study report (runbook step 12)

**Status: DRAFT for author approval. `main.tex` and the ledger are not changed.**

**Why.** The paper now reports the two-annotator study (§3, Appendix D). The camera-ready
`\aiacknowledgements` (`main.tex:34–47`) does not mention the annotation materials:

- **The codebook, its worked examples (W1–W13) and the annotator handbook with its teaching examples
  (H1–H6) were drafted by Claude.** Commit `e50f170` ("Phase C annotation codebook, coordinator protocol,
  and verified materials") is co-authored by Claude Sonnet 5. Protocol §1 point 2 and Amendment 4 state
  that the examples were written by the AI assistant.
- **Coordination support** (ledger U11): validating the returned sheets, running the pre-declared
  analysis, and drafting messages. The author sent the messages.

The paper body already discloses the AI-written worked examples (Limitations, Ethics, Appendix D). The
statement should list the same use.

## Proposed clause

Insert after "...including its equal-cost comparison;":

```latex
drafted the annotation codebook, its worked examples and the annotator handbook, and supported the
two-annotator study's coordination (checking the returned sheets and running its pre-declared analysis),
without assigning, changing or judging any label;
```

The clause adds about 3 lines. It appears in the camera-ready only, after the page limit, and is absent from
the review PDF.

## Proposed ledger row (`research/paper/AI_DISCLOSURE_LEDGER.md`)

| ID | Use | Kind | Where | Disclosed |
|---|---|---|---|---|
| U12 | Annotation materials | GENERATED (adopted by the author) | RESEARCH_PROCESS: `ANNOTATION_CODEBOOK.md` with worked examples W1–W13, `ANNOTATOR_GUIDELINES.md` with H1–H6, the practice set and sheet generator (`e50f170`, `2d8fa7c`, `03527ee`, `9f06c2d`) | Paper: Limitations, Ethics, Appendix D; statement clause above |

The U11 wording would also gain "running the pre-declared analysis whose result the paper reports".
