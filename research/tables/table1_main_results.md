# Table 1 -- Main System Comparison

| System | Overall Acc. (%) | Supported-Task Acc. (%) | OOD Rejection (%) | Ambiguity Success (%) | Low-Overlap Acc. (%) | Latency (ms) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BM25 baseline (A0) | 67.3 | 71.9 | 26.7 | 28.6 | 33.3 | 3.21 |  |
| BM25 no bonus (A1) | - | 71.9 | - | - | - | - |  |
| Dense only (A2) | - | 72.7 | 0 | 21.4 | 46.7 | 5.87 |  |
| Hybrid, nested-CV (A3) | - | 77.1 | 0 | - | - | - |  |
| Hybrid + margin + OOD (A5) | - | 90.1 | 66.7 | - | - | - | coverage=69.5% |
