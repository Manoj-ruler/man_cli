# Table 8 -- Split A vs Split B (Intent-Held-Out Generalization), v0.1 and v0.2

**v0.1**: 125 intent groups, 5 folds, 0 groups split across folds (must be 0). v0.1 has only 15 OOD and 14 ambiguous queries; GroupKFold nested-CV dev pools for these classes are thin (~3/fold test, ~12/fold dev for OOD). OOD/ambiguity detection numbers here are expected to be noisier than the v0.2 Split B analysis for this reason -- the same underpowering already documented for Split A (n=15, p=0.25), not a new artifact.

**v0.2**: 171 intent groups, 5 folds, 0 groups split across folds (must be 0).

| Benchmark | Metric | Split A (class-stratified) | Split B (intent-held-out) | Delta |
| --- | --- | --- | --- | --- |
| v0.1 | Hybrid non-OOD accuracy | 77.06% | 77.04% | -0.02pp |
| v0.1 | OOD detection AUROC | 0.8673 | 0.8494 | -0.0179 |
| v0.1 | OOD detection F1 | 0.5 | 0.4828 | -0.0172 |
| v0.1 | Ambiguity detection F1 | 0.3103 | 0.3 | -0.0103 |
| v0.1 | Calibration ECE (before→after) | 0.2741→0.0537 | 0.2735→0.0646 | 0.0109 |
| v0.2 | Hybrid non-OOD accuracy | 79.25% | 79.24% | -0.01pp |
| v0.2 | OOD detection AUROC | 0.9006 | 0.8979 | -0.0027 |
| v0.2 | OOD detection F1 | 0.7158 | 0.7071 | -0.0087 |
| v0.2 | Ambiguity detection F1 | 0.4956 | 0.4786 | -0.017 |
| v0.2 | Calibration ECE (before→after) | 0.3237→0.0738 | 0.3237→0.1013 | 0.0275 |
