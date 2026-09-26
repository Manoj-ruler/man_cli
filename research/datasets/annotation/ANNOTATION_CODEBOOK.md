# Annotation Codebook: judging short requests against a fixed command list

**Version 1.0 — frozen before annotation begins (2026-09-26).** If a rule ever has to change, both
annotators are told at the same time and the change is dated and logged; nothing is changed silently.

---

## 1. Your task

Imagine a command-line assistant. A user types a short request such as *"make a zip of this
folder"*. The assistant looks in a **fixed list of 279 Windows/PowerShell commands** (the file
`corpus_view_win32.tsv`, called **the list** below) and returns exactly one command from it.

For each request, you decide how the list relates to it, using three labels (Section 2). You will
label about 80 requests. Plan for 1 to 1.5 hours; you can split it over several sittings.

**Ground rules**

- **Work alone.** Do not discuss any request with anyone, including the other annotator.
- **Judge against the list, not against what a shell can do in general.** Use Ctrl+F on the list.
- **Do not use search engines or AI assistants to decide a label.** Your own knowledge of how
  people use command lines is exactly what we want.
- **Do not look for where these requests came from.** Do not search for them, and do not open any
  project repository, paper, or benchmark file.
- The requests are in random order and you are **not told where they came from**. There is no
  answer key you are graded against. We want your honest reading of the rules.
- If you are unsure, pick the label you could defend and mark low confidence. That is useful data,
  not a failure.
- You may ask the coordinator questions **about these rules**, never about a specific request. Any
  answer is sent to both annotators at once and logged.

We know the edges are subjective. What we measure is whether two careful people following the same
steps reach the same label.

---

## 2. The three labels

| Label | Meaning |
|---|---|
| **CLEAR** | Exactly one task is plausibly meant, and the list has a command that performs it (possibly several equivalent ones). |
| **AMBIGUOUS** | Two or more *different* tasks are plausibly meant, the list has a command for each, and the request does not say which. |
| **OOD** (out of the list) | The list has **no** command that performs the task the request asks for. |

---

## 3. Key terms

- **Record**: one row of the list (an id such as `tac-0258`, an intent, a command).
- **Reading**: a specific task a real user might have in mind when typing the request.
- **Performs**: a record performs a reading if running it, after filling in obvious placeholders
  (file names, host names, counts), would do what the user asked **without changing how the command
  is built**. Adding a loop, a pipe, or another tool is changing it.
- **Variants**: records that do the *same thing* to the user's system. A different tool, wording or
  option that does not change the effect makes them variants of **one** task.
- **Distinct tasks**: records that do *different things*. This includes differences in **effect on
  data** (list vs. delete, delete one vs. delete all, safe vs. forced), in **scope** (this machine
  vs. a remote server vs. a container), and in **ecosystem** (npm vs. pip).
- **Plausible reading**: a reading held by a substantial minority of the people who would type these
  exact words, roughly **one in five or more**. A reading held by hardly anyone is not plausible,
  even if it is technically possible. A reading that requires ignoring part of the words does not
  count.

---

## 4. Procedure — follow these steps, in order, for every request

**Step 1 — List readings.** Write down 1 to 3 readings. Ask yourself: is an object missing
("delete it")? Is the scope unstated (local, remote, container)? Does the verb have several senses?
Is there a safe version and a destructive version?

**Step 2 — Search the list.** For each reading, search the list (intents, commands, categories) for
records that *perform* it. Note their ids.

**Step 3 — Decide.**

- **a.** No reading has a performing record → **OOD**.
- **b.** Keep only the readings that have a performing record; a reading the list cannot perform does
  not count toward ambiguity. If **one** reading remains → **CLEAR**.
- **c.** If **two or more** remain, apply the plausibility test: *is the second reading plausible
  (one in five or more), and would a user with that reading be badly served by the record for the
  first?* If yes → **AMBIGUOUS**. If no → **CLEAR** (there is a dominant reading, even though other
  readings are technically possible).

**Step 4 — Record** your answer (Section 5).

---

## 5. What to record for each request

| Field | Values |
|---|---|
| `label` | `CLEAR`, `AMBIGUOUS`, or `OOD` |
| `confidence` | `1` = could easily go the other way, `2` = fairly sure, `3` = certain |
| `record_ids` | ids of the records that perform each reading you kept (up to 4), or `none` for OOD |
| `comment` | optional, one line: why, or what you were unsure about |

Recording the ids matters: it lets us see whether a disagreement is about the list or about the rules.

---

## 6. Special cases

**6.1 Bare names.** A request that is only a tool or topic name (a single word such as a program or
subject) **names no task**. Treat every record whose intent, command or category mentions that name
as a candidate reading.

- If **three or more** of them perform distinct tasks → **AMBIGUOUS**. Nothing was asked, so no
  reading can be dominant.
- If exactly **one** → **CLEAR**.
- If exactly **two** → apply the plausibility test.
- If **none** → **OOD**.

Do not decide by asking "what would *I* use it for?". Your own habit is one reading among many.

**6.2 Phrases with a task but no scope.** When a phrase names a task but leaves out the scope or
object, use the plausibility test in Step 3c. Only consider readings the words can actually support.
Do not invent a far-fetched reading to make a request ambiguous, and do not ignore a common one to
make it clear.

**6.3 Effect on data.** Records that differ in what they do to the user's data are distinct tasks
even when they share a program (delete vs. force-delete, delete one vs. delete all unused). But
scope words in the request can rule a reading out (example W4).

**6.4 Equivalent alternatives.** Several records for the same goal are variants, not ambiguity
(example W3).

**6.5 Partial coverage.** If a record handles one item where the request says "every" or "all", or
handles only part of the task, it does not perform the task → **OOD** (example W12). Filling in
placeholders is allowed; restructuring the command is not.

**6.6 Odd-looking records.** A few records look like Linux/macOS commands (for example `sudo reboot`
or `crontab -l`). Treat them like any other record. Do not judge whether they would run on Windows.

**6.7 Sensitive requests.** If a request asks for something risky or harmful, label it the same way
as any other. Whether it *should* be answered is not part of this task.

**6.8 Wording.** Read typos and informal wording charitably.

---

## 7. Worked examples

These were written by the codebook authors to illustrate the rules. **None of them is a request you
will be asked to label.** Record ids refer to the list.

<!-- EXAMPLES:START (generated by build_annotation_materials.js; do not edit by hand) -->

**W1. "make a zip of this folder" → CLEAR**
  - *create a zip archive of a folder*: tac-0258 (`Compress-Archive -Path 'directory/*' -DestinationPath 'archive.zip'`)
  - One reading, one record that performs it. Nothing else in the list zips a folder.

**W2. "upgrade requests with pip" → CLEAR**
  - *upgrade one pip package*: tac-0128 (`pip install --upgrade package-name`)
  - The request names both the tool and the task. The other pip records (install, list, uninstall) do different things and essentially nobody who writes these words wants them.

**W3. "which process is eating my CPU" → CLEAR**
  - *see which processes use the most CPU*: tac-0032 (`Get-Process | Sort-Object CPU -Descending`); tac-0221 (`Get-Process | Sort-Object CPU -Descending | Select-Object -First 20`)
  - Two records, but both sort processes by CPU: same effect, different wording. Equivalent records are variants of one task, not ambiguity. (tac-0219 'show cpu info' answers a different question and is not a plausible reading of these words.)

**W4. "shut down my compose stack" → CLEAR**
  - *stop the docker compose services*: tac-0099 (`docker compose down`)
  - *stop every running container*: tac-0013 (`docker stop $(docker ps -q)`)
  - Two supported readings exist, but the words name a compose stack. Almost nobody who writes this wants every running container stopped, so the second reading fails the plausibility test (Step 3). One dominant reading: CLEAR.

**W5. "tmux" → AMBIGUOUS**
  - *start a session*: tac-0315 (`tmux new -s session-name`)
  - *list sessions*: tac-0316 (`tmux ls`)
  - *attach to a session*: tac-0317 (`tmux attach -t session-name`)
  - *kill a session*: tac-0318 (`tmux kill-session -t session-name`)
  - A bare tool name: it names no task. Four records for it perform four different tasks, so no reading can be dominant. AMBIGUOUS by the bare-name rule (Section 6.1).

**W6. "uninstall a library" → AMBIGUOUS**
  - *uninstall an npm package*: tac-0116 (`npm uninstall package-name`)
  - *uninstall a pip package*: tac-0127 (`pip uninstall package-name`)
  - Two package ecosystems, each a common reading among people who write this; a user of one is badly served by the record for the other. (A Windows system package, tac-0354, is a poor reading of the word library, so it is not counted.)

**W7. "free up docker space" → AMBIGUOUS**
  - *remove all unused images*: tac-0014 (`docker image prune -a`)
  - *remove all stopped containers*: tac-0103 (`docker container prune`)
  - *remove all unused volumes*: tac-0419 (`docker volume prune -f`)
  - Three cleanups, each a common reading of "free up space", and each destroys something different (images can be re-pulled; volumes hold data). Readings that differ in effect on your data are distinct tasks (Section 6.3), and a user who meant one is badly served by another.

**W8. "check whether a host is reachable" → CLEAR**
  - *ping a host*: tac-0187 (`Test-Connection -ComputerName google.com -Count 4`)
  - *test whether a specific port is open*: tac-0199 (`Test-NetConnection -ComputerName hostname -Port 80`)
  - Ping is the dominant reading of 'reachable'. Testing one port is a narrower question that few users mean by these words, so it fails the plausibility test.

**W9. "compile my rust project" → OOD**
  - *compile a Rust project*: **no record**
  - A real terminal task, but no record compiles a Rust project or any other program. OOD means "the list cannot perform this", not "a shell cannot".

**W10. "reserve a table at an Italian restaurant" → OOD**
  - *reserve a restaurant table*: **no record**
  - Not a computing task at all.

**W11. "set up nginx as a reverse proxy" → OOD**
  - *configure nginx*: **no record**
  - The tool is absent from the list. Do not label it by what a shell could do.

**W12. "rename every file in this folder to lowercase" → OOD**
  - *bulk rename*: **no record**
  - Borderline. tac-0141 renames ONE file. Filling in placeholders is allowed, but turning it into a loop over every file changes the command's structure, so the record does not perform this task.

**W13. "encrypt a file with a password" → CLEAR**
  - *encrypt a file symmetrically with gpg*: tac-0364 (`gpg -c filename.txt`)
  - The list can do this (tac-0364 asks for a passphrase). A task that is done differently in real life is still CLEAR if a record performs it.

<!-- EXAMPLES:END -->

---

## 8. One-page summary

1. List 1–3 **readings** of the request.
2. Find the **records** that perform each one (Ctrl+F).
3. No performing record for any reading → **OOD**.
4. Exactly one supported reading → **CLEAR**.
5. Two or more supported readings → ask: is the other reading held by about **one in five or more**
   of the people typing this, and would they be badly served by the first? **Yes → AMBIGUOUS.
   No → CLEAR.**
6. Bare tool/topic name: **3 or more distinct tasks → AMBIGUOUS**, 1 → CLEAR, 2 → plausibility
   test, 0 → OOD.
7. Same effect = **variants** (one task). Different effect on data, scope, or ecosystem =
   **distinct tasks**.
8. Record `label`, `confidence` (1–3), `record_ids`, optional `comment`.
