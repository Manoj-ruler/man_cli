# Table 8 -- Split A vs Split B (Intent-Held-Out Generalization), v0.2

171 intent groups, 5 folds, 0 groups split across folds (must be 0).

| Metric | Split A (class-stratified) | Split B (intent-held-out) | Delta |
| --- | --- | --- | --- |
| Hybrid non-OOD accuracy | 79.25% | 79.24% | -0.01pp |
| OOD detection AUROC | 0.9006 | 0.8979 | -0.0027 |
| OOD detection F1 | 0.7158 | 0.7071 | -0.0087 |
| Ambiguity detection F1 | 0.4956 | 0.4786 | -0.0170 |
| Calibration ECE (before→after) | 0.3237→0.0738 | 0.3237→0.1013 | 0.0275 |
