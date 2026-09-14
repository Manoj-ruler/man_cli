# Table 5 -- v0.1 vs v0.2 Replication Check

| Comparison | v0.1 n | v0.1 p-value | v0.1 Significant | v0.2 n | v0.2 p-value | v0.2 Significant | Replicated? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A0 vs A1 | 135 | 1 | false | 159 | 1 | false | Yes |
| A0 vs A2 | 135 | 1 | false | 159 | 0.424356 | false | Yes |
| A0 vs A3 | 135 | 0.015625 | true | 159 | 0.070313 | false | **NO** |
| A2 vs A3 | 135 | 0.145996 | false | 159 | 0.012726 | true | **NO** |
| OOD rejection (baseline vs tuned) | 15 | 0.25 | false | 50 | 0.000015 | true | **NO (resolved)** |
