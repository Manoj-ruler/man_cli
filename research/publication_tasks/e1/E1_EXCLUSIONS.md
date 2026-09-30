# E1-03: exclusion rules for P1 (CLINC150 in-scope `test`), decided before any scoring

**Written:** 2026-09-30. **Status: approved by the author on 2026-09-30 (D3 = Rule A with subgroup
S).**

## What was looked at, and what was not

**Looked at:**

- the 150 intent names, by domain (`research/data_external/clinc150/domains.json`);
- 4 example queries per intent from the **train split only**, for 43 candidate intents chosen by
  name (scratchpad `e1_03_review.js`);
- the tool's Windows-visible corpus (`cli/data/commands.json`): its intents, descriptions and
  command strings;
- the benchmark's out-of-scope definition (`research/datasets/annotation/ANNOTATION_CODEBOOK.md`,
  `research/datasets/TERMASSIST_BENCH_DESIGN.md`);
- the CLINC paper's Table 1.

**Not looked at:**

- **no query from `test` or `oos_test`**, the populations E1 scores;
- **no system output**: nothing was run, retrieved or scored.

## The criterion: the benchmark's own out-of-scope definition

The codebook defines an out-of-scope label as "the list has **no** command that performs the task
the request asks for" (line 47). Example W9 (line 196) spells it out: "OOD means 'the list cannot
perform this', not 'a shell cannot'".

The paper's v0.2 out-of-scope set was built on this definition. It includes terminal tasks the corpus
does not cover (the `near_ood` and `unsupported_tool_ood` kinds). **For E1's rates to be comparable
with v0.2's, E1 should use the same definition.**

## Finding

**No CLINC intent's typical request is performed by any Windows-visible corpus record.** The closest
records do other things:

| Candidate intent | Closest corpus records | Why they do not perform the request |
|---|---|---|
| `date`, `time` | tac-0227 "check system uptime" (uses `Get-Date`); tac-0003 and tac-0068 (files modified today or in the last 7 days) | None returns today's date or the time. `time` asks for other cities' times. |
| `timezone` | none (no `tzutil` or `Get-TimeZone`) | — |
| `calculator`, `measurement_conversion` | none | — |
| `flip_coin`, `roll_dice` | tac-0363 "generate a random password" (`openssl rand`) | not a coin or die |
| `timer`, `alarm`, `reminder_update` | tac-0303 "repeat a command every 2 seconds" (`Start-Sleep`) | not a timer or alarm |
| `change_volume` | tac-0238 `Get-Volume`, and the docker volume records | disk or docker volumes, not audio |
| `weather`, `exchange_rate` | the curl records ("download a file", "make a GET request") | a generic HTTP tool, with no weather or exchange service |
| `sync_device`, `reset_settings` | tac-0240 "synchronize files between directories"; tac-0055 "reset working directory to last commit" | file sync and git reset, not device pairing or assistant settings |
| everything else (banking, travel, kitchen, small talk, meta, …) | none | — |

## Proposed rules (decision D3)

**Rule A, primary: exclude an intent iff a Windows-visible corpus record performs its typical
request.**

- Result: **0 intents excluded. All 150 intents (4,500 queries) are in P1.**
- This involves no judgement about what "a shell could do", and uses the same definition as v0.2.

**Subgroup S: requests a shell could answer, although this corpus cannot.** This is descriptive,
**not an exclusion**. These intents stay in P1 and are **also** reported as a labelled subgroup. They
resemble v0.2's terminal-task out-of-scope kinds, so the rules' behaviour on them is informative in
its own right:

| Tier | Intents | Why a stock Windows shell could answer them |
|---|---|---|
| **S-clear** (6) | `date`, `calculator`, `measurement_conversion`, `flip_coin`, `roll_dice`, `timer` | `Get-Date`; PowerShell arithmetic; arithmetic; `Get-Random`; `Get-Random`; `Start-Sleep` |
| **S-borderline** (7) | `time` (other cities), `timezone` (other countries), `alarm`, `reminder_update`, `weather`, `exchange_rate`, `current_location` | possible only with time-zone conversion, the Task Scheduler, or a web API. Not a typical one-liner on a stock system. |

**Planned sensitivity check** (specified here; its analysis goes in §6):

- recompute P1's results **without S-clear**, and **without S-clear and S-borderline**;
- the primary result stays the full 150 intents.

**P2 (`oos_test`)** is kept whole, as decided in D4. It has no classes, so neither Rule A nor
subgroup S can be applied to it. Its limitation (it may contain requests a shell could answer) is
stated in §2.4.

## Alternative for the author (not recommended)

**Rule B:** exclude every intent a shell could answer (S-clear, or also S-borderline) from the
primary population. This follows the plan's original wording ("requests that may have a legitimate
shell answer").

It is not recommended because:

- it departs from the definition behind the v0.2 numbers, so E1 would not be comparable;
- it removes exactly the shell-flavoured requests on which a threshold is most likely to fail, so it
  could inflate the rejection rates.

## The domain map (`domains.json`), cross-checked

- All **10 intent–domain pairs shown in the paper's Table 1** match `domains.json`. The table's text
  extraction is shifted by one row, and was re-aligned by hand. The pairs: transfer–banking,
  pto_request–work, change_language–meta, distance–auto & commute, travel_suggestion–travel,
  todo_list_update–home, text–utility, food_last (food expiration)–kitchen & dining,
  tell_joke–small talk, rewards_balance–credit cards.
- The **full** list of 150 is in the paper's supplementary ZIP. That was **not checked**: it would
  be another download.
- The domain map is used only to **group results for description** (per-domain rates). No exclusion
  depends on it.
