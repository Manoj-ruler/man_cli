# Table 7 -- Holm-Corrected Significance + Bootstrap CIs (v0.1 and v0.2)

Family size m=4 per benchmark version. Bootstrap: 10,000 resamples, seed 42.

| Benchmark | Comparison | Raw p | Holm-adjusted p | Significant (Holm<0.05) | Bootstrap 95% CI |
| --- | --- | --- | --- | --- | --- |
| v0.1 | A0-vs-A3 accuracy (McNemar) | 0.015625 | 0.046875 | Yes | [2.2, 8.9]pp |
| v0.1 | A2-vs-A3 accuracy (McNemar) | 0.145996 | 0.291992 | No | [-0.7, 9.6]pp |
| v0.1 | baseline-vs-tuned OOD rejection (McNemar) | 0.25 | 0.291992 | No |  |
| v0.1 | calibration ECE reduction (paired bootstrap) | 0.0001 | 0.0004 | Yes | [0.1278, 0.2829] |
| v0.2 | A0-vs-A3 accuracy (McNemar) | 0.070313 | 0.070313 | No | [0.6, 7.5]pp |
| v0.2 | A2-vs-A3 accuracy (McNemar) | 0.012726 | 0.025452 | Yes | [1.9, 11.9]pp |
| v0.2 | baseline-vs-tuned OOD rejection (McNemar) | 0.000015 | 0.00006 | Yes |  |
| v0.2 | calibration ECE reduction (paired bootstrap) | 0.0001 | 0.0003 | Yes | [0.1717, 0.2951] |
