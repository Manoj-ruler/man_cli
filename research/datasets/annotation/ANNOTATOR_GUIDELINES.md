<!--
=====================================================================================================
COORDINATOR: DELETE EVERYTHING FROM HERE TO "END OF COORDINATOR BLOCK" BEFORE SENDING THIS FILE.
=====================================================================================================

## Coordinator clarifications needed (delete before sending)

This handbook was checked against ANNOTATION_CODEBOOK.md (v1.0), corpus_view_win32.tsv (279 records;
columns id, category, intent, command, description), sheets/HOW_TO_RETURN.md, sheets/annotator_1_sheet.csv
and annotator_2_sheet.csv (identical items; columns item_no, query, label, confidence, record_ids,
comment), and sheets/practice/PRACTICE_SHEET.csv (11 rows, same columns). The questions below are not
answered by those files. Rules marked "(provisional)" in the handbook depend on them. Answer each before
sending, then edit or remove the provisional notes to match.

C1. Return channel. HOW_TO_RETURN.md says "send the file back to the coordinator" but gives no email
    address, upload location or deadline. Section 14 has placeholders: [RETURN METHOD] and [CONTACT].
C2. File name. Should annotators keep the issued file name (annotator_N_sheet.csv), or rename it?
    The handbook provisionally says: keep it unchanged.
C3. Practice sheet return. HOW_TO_RETURN.md covers only the main sheet. The handbook provisionally says
    the practice sheet is filled and returned the same way, and that the main sheet follows the feedback.
C4. More than four record ids. Codebook section 5 says "up to 4"; HOW_TO_RETURN.md gives no limit, and
    the validator accepts any number. What should an annotator do when more than four records perform
    readings they kept? Provisionally: record the four most relevant and say so in the comment.
C5. Ids for a CLEAR item whose second reading failed the plausibility test. Codebook section 5 says
    "records that perform each reading you kept", but worked example W4 displays the records of both
    readings. Provisionally: record only the ids of the reading kept (the dominant one, with its
    variants).
C6. Intent/command mismatch. A few records describe the task with Linux wording (e.g. "apt", "linux
    distribution") while the command is a Windows one (e.g. winget, winver). Codebook 6.6 covers
    Linux-looking commands, and the W6 note treats one such record as a Windows system package.
    Provisionally: judge a record by the task it performs described in general terms, not by the
    operating-system or tool name in its wording; mark lower confidence and add a comment when unsure.
C7. Multi-step requests. Codebook 6.5 says a record that "handles only part of the task" does not
    perform it. The handbook applies this to requests that need two separate records (example H6 ->
    OOD). Confirm this is intended.
C8. Looking up unfamiliar commands. The codebook bans search engines and AI assistants "to decide a
    label". May annotators look up what an unfamiliar command in the list does? Provisionally: no; use
    the intent and description columns.
C9. Time. The codebook says 1 to 1.5 hours for the main set. Reading and practice come on top of that.
    No deadline appears in any file, so the handbook states none.
C10. Fill in the two placeholders in Section 14 ([RETURN METHOD], [CONTACT]).

(Background on the teaching examples and their checks is in the coordinator protocol, Amendment 4,
not here.)

=====================================================================================================
END OF COORDINATOR BLOCK
=====================================================================================================
-->

# Annotator Handbook

**How to label short command-line requests against a fixed list of commands**

Thank you for taking part. This handbook explains everything you need: what the task is, how to use the
files you were given, how to decide on each label, and how to return your work. You do not need any
previous knowledge of the project, and you do not need to be a PowerShell expert.

> **The official rules are in `ANNOTATION_CODEBOOK.md`.** This handbook explains those rules in more
> detail and with more examples. It never replaces them. If the two ever seem to disagree, the codebook
> wins; please tell the coordinator about the disagreement.

---

## Contents

1. [Welcome and overview](#1-welcome-and-overview)
2. [What you need before starting](#2-what-you-need-before-starting)
3. [The task in plain English](#3-the-task-in-plain-english)
4. [Understanding the three labels](#4-understanding-the-three-labels)
5. [How to use the 279-command list](#5-how-to-use-the-279-command-list)
6. [The decision procedure](#6-the-decision-procedure)
7. [Matching requests to record ids](#7-matching-requests-to-record-ids)
8. [Confidence rating](#8-confidence-rating)
9. [Difficult cases and common mistakes](#9-difficult-cases-and-common-mistakes)
10. [The practice set](#10-the-practice-set)
11. [The main set](#11-the-main-set)
12. [Independence and prohibited help](#12-independence-and-prohibited-help)
13. [Checking your own work](#13-checking-your-own-work)
14. [Returning your work](#14-returning-your-work)
15. [Frequently asked questions](#15-frequently-asked-questions)
16. [One-page quick reference](#16-one-page-quick-reference)

---

## 1. Welcome and overview

Imagine a helper program for the command line. A person types a short request in ordinary words, such
as *"make a zip of this folder"*. The helper looks in a **fixed list of 279 commands** and answers with
one of them.

For each request on your sheet, you decide **how that fixed list relates to the request**:

- **CLEAR**: the request means one task, and the list has a command that does it.
- **AMBIGUOUS**: the request could mean two or more *different* tasks, the list has a command for each,
  and the words don't say which one is meant.
- **OOD** ("out of the list"): the list has no command that does what the request asks.

For every request you also record **how confident you are** and **which entries in the list** (their
ids, such as `tac-0258`) match. At the end you return one filled-in spreadsheet file.

**The workflow**

> Read the instructions → Do the practice set → Read the feedback → Label the main set → Check your work
> → Return your sheet

Careful and consistent judgments matter far more than speed. There is no answer key you are graded
against. What we want is your honest application of the written rules.

---

## 2. What you need before starting

You should have received four files:

| File | What it is | What you do with it |
|---|---|---|
| `ANNOTATION_CODEBOOK.md` | **The official labeling rules**, with 13 worked examples (W1–W13) | Read it fully before you start, and look back at it whenever you are unsure |
| `corpus_view_win32.tsv` | **The list**: the 279 commands you judge against | Search it for every request (Section 5) |
| `HOW_TO_RETURN.md` | Short instructions for filling in and returning your sheet | Follow them exactly (Section 14) |
| Your sheet: `annotator_N_sheet.csv` (N is your number) | The requests you will label, one per row | Fill in four columns for every row |

You will also receive a **practice sheet** (`PRACTICE_SHEET.csv`) with 11 requests (Section 10).

**Before you begin, check:**

- [ ] I have all the files above and can open each one.
- [ ] I have read `ANNOTATION_CODEBOOK.md` from start to finish.
- [ ] I can search the list (for example with Ctrl+F).
- [ ] I can edit my sheet and save it as CSV.
- [ ] I have enough uninterrupted time for at least one sitting.
- [ ] I will not use a search engine or an AI assistant to decide any label.

---

## 3. The task in plain English

**Key words**

| Term | Meaning |
|---|---|
| **Request** | A short instruction in ordinary words, e.g. *"clone a repo"*. |
| **Command** | A specific instruction a computer's command line understands, e.g. `git clone https://github.com/user/repo.git`. |
| **The list** | The 279 commands in `corpus_view_win32.tsv`. It is the **only** reference you use. |
| **Record** | One row of the list: an id, a category, an intent (what it is for), a command and a description. |
| **Reading** | One specific task that a real person might have in mind when typing the request. |
| **Performs** | A record performs a reading if running it, after filling in obvious blanks (file names, web addresses, counts), would do what the person asked, **without changing how the command is built**. |

**An everyday comparison.** Think of a restaurant with a fixed menu. A customer's order can:

- clearly name one dish that is on the menu (**CLEAR**);
- fit two quite different dishes on the menu, e.g. "the fish" when there is a grilled fish and a fish
  soup (**AMBIGUOUS**);
- ask for something the menu does not have (**OOD**), even if a restaurant somewhere could make it.

Two limits on the comparison: missing small details (like "a large one") do not make an order unclear
(see [Section 9.2](#92-missing-details)), and you judge only the menu you were given.

> **You are matching the request against the supplied list. You are not deciding whether Windows,
> PowerShell or any other tool could do the task in some other way.**

A command you know well but that is **not in the list** cannot be chosen, however useful it would be.

---

## 4. Understanding the three labels

### 4.1 CLEAR

> **CLEAR**: exactly one task is plausibly meant, and the list has a command that performs it (possibly
> several equivalent ones).

- **One intended task.** After listing the readings (Section 6), only one remains that the list can
  perform, or one reading clearly dominates. Codebook Step 3c defines "dominates": any other reading is
  held by fewer than about one in five people typing these words, or would still be well served by the
  same record.
- **Coverage.** At least one record performs that task.
- **Equivalent records.** Several records doing the same thing (same effect, different wording or tool)
  are *variants* of one task. They do not make a request ambiguous. Record all of them (codebook W3).
- **Not CLEAR just because one reading matches.** If a second, *materially different* reading is also
  plausible and the list performs it too, the request is AMBIGUOUS, not CLEAR.

| Example | Reasoning | What to look at in the list | Caution |
|---|---|---|---|
| *"make a zip of this folder"* (codebook W1) | One reading: create a zip archive. One record performs it: `tac-0258`. | See the codebook. | — |
| *"clone a repo"* (H2) | One reading: copy a git repository to this computer. `tac-0050` performs it. The repository address is missing, but it is a blank to fill in, not a second task. | Search "clone". | Missing details are not ambiguity. |
| *"is this page returning a 404 or a 200"* (H1) | 404 and 200 are web response codes. The task is "check a web page's response code", which `tac-0111` performs. | Search "response code" or "http". | The words differ from the record's wording; match by **meaning**, not by words. |
| *"put a v2.0 label on this release"* (H4, borderline) | Reading 1: tag the current git commit (`tac-0051`). Reading 2: re-tag an existing docker image, which no record performs (`tac-0089` *builds* an image, it doesn't re-tag one). A reading the list can't perform doesn't count, so one supported reading remains. | Search "tag". | Check what a record actually does; a shared word ("tag") is not enough. |
| *"shut down my compose stack"* (codebook W4, borderline) | Two supported readings, but the words name a compose stack; almost nobody typing them means "stop every container". | See the codebook. | Words in the request can rule a reading out. |

### 4.2 AMBIGUOUS

> **AMBIGUOUS**: two or more *different* tasks are plausibly meant, the list has a command for each, and
> the request does not say which.

All three conditions must hold:

1. **Materially different tasks.** The records do different things, not the same thing in different
   ways. The codebook counts as different: a different **effect on data** (list vs. delete, delete one
   vs. delete all, safe vs. forced), a different **scope** (this machine vs. a remote server vs. a
   container), or a different **ecosystem** (e.g. npm vs. pip).
2. **Each reading is plausible.** It is held by roughly **one in five or more** of the people who would
   type these exact words, and a person with that reading would be **badly served** by the record for
   the other reading.
3. **The list performs each of them.** A reading the list cannot perform does not count.

| Example | Reasoning | What to look at in the list | Caution |
|---|---|---|---|
| *"uninstall a library"* (codebook W6) | npm and pip packages are both common readings; a user of one is badly served by the other. | See the codebook. | Don't count far-fetched readings (see the codebook's note). |
| *"free up docker space"* (codebook W7) | Three cleanups, each destroying something different. | See the codebook. | Different effects on data make distinct tasks. |
| *"tmux"* (codebook W5) | A bare tool name asks for no task; four records do four different things. | See the codebook. | Bare names have their own rule (Section 9.6). |
| *"call the api endpoint"* (H3) | Fetching data (`tac-0105`) and sending data (`tac-0011`) differ in effect, both are common readings of "call", and someone who meant one is badly served by the other. Record both ids. | Search "request", "api". | Other records (e.g. for replacing or deleting data) may exist. Whether *those* are plausible readings of these words is your plausibility judgment. Do not add readings just because a record exists. |

**Three situations to keep apart:**

| Situation | Label |
|---|---|
| One task, but details are missing (which file, which address) | **CLEAR**, if the list performs the task. Missing details are just blanks to fill in. |
| Several plausible, materially different tasks, each performed by the list | **AMBIGUOUS** |
| One reading the list performs, and another reading it does not | The unsupported reading **does not count** (codebook Step 3b) → **CLEAR** |

### 4.3 OOD (out of the list)

> **OOD**: the list has **no** record that performs the task the request asks for.

- OOD is judged **against the list only**. A task Windows can certainly do is still OOD here if no record
  performs it (codebook W9: *"compile my rust project"*).
- Wording is not the test. If a record really performs the task in different words, it is **not** OOD
  (see H1 above).
- Do not grab a loosely related record. Sharing a word is not performing the task.

| Example | Reasoning | What to look at in the list | Caution |
|---|---|---|---|
| *"reserve a table at an Italian restaurant"* (codebook W10) | Not a computing task at all. | Nothing to find. | — |
| *"set up nginx as a reverse proxy"* (codebook W11) | The tool is absent from the list. | See the codebook. | Don't judge by what a shell could do. |
| *"print this report on the office printer"* (H5) | Several records contain the word *print*, but they display text on screen; none sends anything to a printer. | Search "print" and read each description. | A shared word is not a match. |
| *"rename every file in this folder to lowercase"* (codebook W12, borderline) | `tac-0141` renames **one** file. Doing every file needs a loop, which changes how the command is built. | See the codebook. | Partial coverage is not coverage (Section 9.3). |

### 4.4 The labels side by side

| Question | CLEAR | AMBIGUOUS | OOD |
|---|---|---|---|
| How many plausible, supported readings? | One (or one dominant) | Two or more, materially different | None the list can perform |
| Are several materially different meanings plausible? | No (or only ones the list can't perform) | Yes | Irrelevant |
| Does the list perform the task(s)? | Yes, the one task | Yes, each plausible task | No |
| What goes in `record_ids`? | The id(s) performing that task, including equivalent variants | The ids performing each plausible reading (at least two ids in total) | `none` |

---

## 5. How to use the 279-command list

### 5.1 What is in the file

`corpus_view_win32.tsv` is a plain-text table. Each line is one record; fields are separated by a **tab**
character. The first line names the columns:

| Column | Meaning | Example |
|---|---|---|
| `id` | The record's identifier. **This is what you copy into your sheet.** | `tac-0050` |
| `category` | A rough topic group | `git` |
| `intent` | What the record is for, in plain words | `clone a git repository` |
| `command` | The actual command | `git clone https://github.com/user/repo.git` |
| `description` | A one-line explanation | `Clone a remote repository locally` |

Commands often contain **placeholders**: sample values you would replace, such as `filename.txt`,
`branch-name`, `hostname`, `package-name` or `https://example.com`. Filling them in is allowed.

### 5.2 Opening and searching it

- **In a text editor** (e.g. Notepad): open the file and use **Ctrl+F**. Each record is one line.
- **In a spreadsheet program** (e.g. Excel): the tabs become columns, which makes it easier to read. Use
  **Ctrl+F**, or a filter on the `category` column. Do not save changes to the list.

**How to search well:**

- Search for the **action** ("delete", "compress", "download") and for the **thing acted on** ("branch",
  "image", "file"). Try synonyms: folder/directory, remove/delete, show/list/view.
- Search the `intent`, `command`, **and** `category` columns (codebook Step 2).
- For a tool name, search the name itself (e.g. "docker").
- **Read the `intent` and `description`** of every candidate before deciding it performs the reading.

### 5.3 You don't need to know PowerShell

The `intent` and `description` columns tell you what each record does in plain words. Rely on them.

> **Never run any command on your computer to test a request.** Some commands delete data or change
> system settings. Your job is to classify using the list and the rules, not to carry out the task.

### 5.4 Records that look unusual

- **Linux- or macOS-looking commands** (e.g. `sudo reboot`, `crontab -l`): treat them like any other
  record. Do not judge whether they would run on Windows (codebook 6.6).
- **Wording and command that don't match** *(provisional guidance)*: a few records describe their task in
  Linux terms (for example, mentioning "apt") while the command itself is a Windows one. Judge the record
  by the **task it performs, described in general terms** (e.g. "install a system package"), not by the
  operating system or tool named in the wording. If this affects your decision, lower your confidence and
  say so in the comment.

---

## 6. The decision procedure

Use these steps, in order, for **every** request. They follow codebook Section 4, and the codebook takes
precedence if anything differs.

**Step 1: Read the whole request.** Read typos and informal wording charitably (codebook 6.8).
*Mistake to avoid:* reacting to one keyword and ignoring the rest.

**Step 2: List 1 to 3 readings.** Ask yourself:
- Is an object missing ("delete *it*")?
- Is the scope unstated (this computer, a remote server, a container)?
- Does the verb have several senses?
- Is there a safe version and a destructive version?

*Why:* ambiguity can only be judged if you first spell out what people might mean.
*Mistakes to avoid:* inventing far-fetched readings, and ignoring a common one.

**Step 3: Do not add assumptions.** Take the words as they are. Don't assume details the request doesn't
state, and don't ignore details it does state.

**Step 4: Search the list for each reading.** Note the ids of records that **perform** it (Section 5).
*Mistake to avoid:* accepting a record because it shares a word with the request.

**Step 5: Drop the unsupported readings.** A reading with no performing record does not count.

**Step 6: Decide.**
- No reading has a performing record → **OOD**.
- One reading remains → **CLEAR**.
- Two or more remain → apply the **plausibility test**:
  - Is the other reading held by about **one in five or more** people typing these words?
  - Would such a person be **badly served** by the record for the first reading?
  - **Yes → AMBIGUOUS.** No → **CLEAR** (one reading dominates).
- A request that is only a tool or topic name follows the **bare-name rule** (Section 9.6).

**Step 7: Record the ids** (Section 7).

**Step 8: Record your confidence**: `1`, `2` or `3` (Section 8).

**Step 9: Add a comment if useful.** It is optional: one line on why, or what you were unsure about.

**Step 10: Re-read the row** before moving on. Check the label spelling, confidence and ids.

**Decision tree**

```
Read the request
      |
Is it only a tool or topic name?  --yes-->  Bare-name rule (Section 9.6)
      | no
List 1-3 readings; search the list for records that PERFORM each
      |
Does any reading have a performing record?  --no-->  OOD      (record_ids: none)
      | yes
Drop readings with no performing record
      |
How many readings remain?  --one-->  CLEAR    (record_ids: that reading's records)
      | two or more
Is the other reading plausible (about 1 in 5 or more)
AND badly served by the first reading's record?
      |-- yes -->  AMBIGUOUS  (record_ids: records for each kept reading)
      |-- no  -->  CLEAR      (record_ids: the dominant reading's records)
```

---

## 7. Matching requests to record ids

**What counts as a genuine match.** A record matches a reading only if it **performs** it: running it,
with the blanks filled in, would do what was asked without restructuring the command.

- **Allowed:** filling in placeholders (file names, addresses, numbers).
- **Not allowed:** adding a loop, a pipe, or another tool; handling one item when the request says
  "every" or "all"; handling only part of the task (codebook 6.5).

**What to enter in the `record_ids` column**

| Label | Enter |
|---|---|
| CLEAR | The id(s) of the record(s) performing the task, including equivalent variants, e.g. `tac-0032;tac-0221` (codebook W3) |
| AMBIGUOUS | The ids of the records performing **each** plausible reading you kept, so at least two ids, e.g. `tac-0116;tac-0127` |
| OOD | The word `none` |

**Format rules** (from `HOW_TO_RETURN.md` and codebook Section 5):

- Copy ids **exactly** as they appear in the `id` column (e.g. `tac-0050`). Never invent or guess an id.
- Separate several ids with **semicolons**, no spaces needed: `tac-0116;tac-0127`.
- List **up to 4** ids (codebook Section 5). *(Provisional: if more than four records perform readings
  you kept, enter the four most relevant and write "more than 4" in the comment.)*
- For a CLEAR request where you considered a second reading but it failed the plausibility test, enter
  only the ids of the reading you kept. *(Provisional: this follows codebook Section 5, "readings you
  kept".)*

**Correct and incorrect matching**

| Request | Correct | Incorrect | Why |
|---|---|---|---|
| *"clone a repo"* (H2) | CLEAR, `tac-0050` | AMBIGUOUS because the address is missing | Missing details are placeholders. |
| *"print this report on the office printer"* (H5) | OOD, `none` | CLEAR with a record whose intent contains "print" | Those records display text on screen; they don't use a printer. |
| *"which process is eating my CPU"* (codebook W3) | CLEAR, `tac-0032;tac-0221` | AMBIGUOUS because there are two records | Same effect = variants of one task. |
| *"put a v2.0 label on this release"* (H4) | CLEAR, `tac-0051` | Adding `tac-0089` because it mentions a tag | `tac-0089` builds an image; it does not tag a release. |

**Choose by what the record does, not by what you would personally use.** Your own habit is one reading
among many (codebook 6.1).

---

## 8. Confidence rating

Your confidence is how sure **you** are about **your own label and ids**. The scale comes from codebook
Section 5:

| Value | Meaning | When to choose it | Example situation |
|---|---|---|---|
| `1` | Could easily go the other way | The plausibility test was a close call, or you're unsure whether a record really performs the task | You can't tell if a second reading is held by one in five people |
| `2` | Fairly sure | You applied the rules and are fairly sure, but can see some room for doubt | One reading clearly dominates, but a minor alternative crossed your mind |
| `3` | Certain | The rules give one answer and you see no reasonable alternative | A non-computing request with nothing in the list |

> Low confidence is **useful information, not a failure**. If you are unsure, pick the label you could
> defend, choose `1`, and say why in the comment.

---

## 9. Difficult cases and common mistakes

### 9.1 Vague wording
**Problem:** the words could be read several ways. **Rule:** list the readings the words can actually
support, then apply the plausibility test (codebook 6.2). Don't invent a far-fetched reading to make a
request ambiguous, and don't ignore a common one to make it clear. **Example:** H3, *"call the api
endpoint"*.

### 9.2 Missing details
**Problem:** the request leaves out a file name, address or number. **Rule:** that is a placeholder, not a
second task. Missing details alone never make a request ambiguous. **Record:** CLEAR with the record's id,
if the list performs the task. **Example:** H2, *"clone a repo"*.

A missing **scope** or **object** is different (e.g. local vs. remote, *which kind* of thing). It can
create different readings, which you then test for plausibility (codebook Step 1 and 6.2).

### 9.3 Several actions, or a sequence of commands
**Problem:** the request asks for two things, or would need several commands one after another.
**Rule:** a record must perform the **whole** task. A record that handles only part of it does not
perform it (codebook 6.5). **Record:** if no single record does the whole task → OOD, `none`.
**Examples:**
- H6, *"stage everything and commit it with a message"*: `tac-0037` stages and `tac-0038` commits, but
  no single record does both → OOD *(provisional application of codebook 6.5)*.
- Codebook W12: renaming *every* file needs a loop.

### 9.4 It sounds like a listed task, but it's a different operation
**Problem:** a record shares words with the request but does something else. **Rule:** read the
record's intent and description; shared words are not a match. **Examples:**
- H5: "print" records display text; they don't send anything to a printer.
- Codebook W3's note: "show cpu info" answers a different question from "which process is eating my
  CPU".

### 9.5 The tool you'd use isn't in the list
**Rule:** judge only against the list. If no record performs the task → OOD, however familiar the missing
command is. **Examples:** codebook W9 and W11.

### 9.6 Bare names: the request is just one word or a tool name
**Problem:** a request like *"tmux"* names no task. **Rule (codebook 6.1):** treat every record whose
intent, command or category mentions that name as a candidate reading, then count the **distinct** tasks:

| Distinct tasks among those records | Label |
|---|---|
| 3 or more | **AMBIGUOUS** (nothing was asked, so no reading can dominate) |
| Exactly 2 | Apply the plausibility test |
| Exactly 1 | **CLEAR** |
| None | **OOD** |

Count **distinct tasks**, not records: equivalent records count once. Do not decide by asking "what would
*I* use it for?". **Example:** codebook W5.

### 9.7 The meaning matches but the wording doesn't
**Rule:** match by meaning. **Example:** H1, *"is this page returning a 404 or a 200"* → `tac-0111`
(check a page's response code).

### 9.8 Scope words in the request
**Rule:** words in the request can rule a reading out (codebook 6.3, W4). **Example:** *"shut down my
compose stack"* names the compose stack, so "stop every container" is not a plausible reading.

### 9.9 Different effects on your data
**Rule:** records that differ in what they do to data (delete vs. force-delete, one vs. all, keep vs.
discard) are **distinct tasks**, even within one program (codebook 6.3). **Example:** codebook W7.

### 9.10 Equivalent alternatives
**Rule:** several records for the same goal are variants of **one** task, not ambiguity (codebook 6.4).
Record all of them. **Example:** codebook W3.

### 9.11 Tempted to guess what the person "really" wants
**Rule:** don't fill gaps with your own preference. List the readings the words support and let the
plausibility test decide. If you are torn, choose the label you can defend, confidence `1`, and a
comment.

### 9.12 Risky or sensitive requests
**Rule:** label them exactly like any other request. Whether a request *should* be answered is not part
of this task (codebook 6.7).

### 9.13 Every request gets one of the three labels
There is no "skip" or "unclassifiable" label. If you can't decide, pick the most defensible label and
use confidence `1`.

---

## 10. The practice set

Before the main set you will label **11 practice requests** on `PRACTICE_SHEET.csv`. The sheet has the
same columns as the main sheet, and you fill it in the same way.

**Why practice:**
- to learn the rules by using them;
- to get used to searching the list;
- to get used to the sheet;
- to find rules you find confusing *before* the real work.

**How it works:**
1. Label all 11 requests alone, exactly as you will the main set.
2. Return the practice sheet to the coordinator. *(Provisional: the same way as the main sheet;
   see Section 14.)*
3. You will then receive written **feedback** with the codebook authors' answers and reasoning.
   Practice answers are not part of the results.
4. Read the feedback carefully, especially where you differed, and re-read the codebook steps it cites.
5. Then start the main set.

If a practice request confuses you, re-read the relevant codebook section, record your best label with
low confidence and a comment, and if needed ask the coordinator a question **about the rules** (not about
the request). Do not discuss it with anyone else.

---

## 11. The main set

Your sheet contains about 80 requests, one per row. **Every row must be labeled.**

- **Order:** do not reorder, sort or delete rows (`HOW_TO_RETURN.md`). *Suggestion:* work from top to
  bottom so you can easily see where you stopped.
- **Time:** the codebook suggests planning **1 to 1.5 hours** for the main set. You may split it over
  several sittings.
- **Saving:** save your sheet (as CSV, Section 14) at the end of every sitting, and ideally every few
  rows.
- **Resuming:** open the saved file and continue from the first row with an empty `label` column.
- **Skips and duplicates:** each request appears once. Before finishing, check that no `label`,
  `confidence` or `record_ids` cell is empty.
- **Reviewing uncertain rows:** you may revisit a row if you realise you misapplied a rule. Do **not**
  change labels just to make your answers look more consistent or evenly spread. Each request is judged
  on its own.
- **Deadline:** none is given in these materials. Ask the coordinator if you need one.

---

## 12. Independence and prohibited help

> **These rules are essential. Please follow all of them.**

**You must not:**
- discuss any request, or your decisions, with anyone, including anyone else who may be doing the same
  task;
- compare sheets or exchange tentative labels with anyone;
- use search engines to decide a label;
- use AI assistants, chatbots or automatic tools to decide a label;
- look for where the requests came from, search for them online, or open any project repository, paper
  or data file other than the ones you were given;
- use outside command references to override the list. *(Provisional: rely on the `intent` and
  `description` columns to understand what a record does.)*

**You may:**
- read the codebook and this handbook as often as you like;
- search and read the list;
- ask the coordinator questions about **the rules, the files or technical problems**. Never ask about a
  specific request. Any answer about the rules is shared, at the same time, with everyone doing the task,
  and logged (codebook Section 1).

**Why:** everyone must apply the same written rules to the same information, without outside hints or
coordination. That is the only way the results mean anything.

---

## 13. Checking your own work

Before returning your sheet, check:

- [ ] Every row has a `label`, spelled exactly `CLEAR`, `AMBIGUOUS` or `OOD`.
- [ ] Every row has a `confidence` of `1`, `2` or `3`.
- [ ] CLEAR rows have at least one id; AMBIGUOUS rows have at least two; OOD rows say `none`.
- [ ] Every id is copied exactly from the list's `id` column, and several ids are separated by
      semicolons.
- [ ] No row is empty, missing, duplicated or moved.
- [ ] The `item_no` and `query` columns are unchanged.
- [ ] Comments are one line and factual.
- [ ] Uncertain rows have honest, low confidence.
- [ ] The file is saved as CSV (Section 14).

This check is for catching slips, not for second-guessing yourself or trying to guess what anyone
"wants".

---

## 14. Returning your work

From `HOW_TO_RETURN.md`:

1. Open `annotator_N_sheet.csv` in Excel or any editor.
2. Fill in the last four columns for **every** row:
   - `label`: `CLEAR`, `AMBIGUOUS` or `OOD` (exactly these words);
   - `confidence`: `1`, `2` or `3`;
   - `record_ids`: the id(s) separated by semicolons (e.g. `tac-0116;tac-0127`), or `none` for OOD;
   - `comment`: optional, one line.
3. Do not change the `item_no` or `query` columns. Do not reorder rows.
4. **Save as CSV** and send the file back to the coordinator.

**Sending the file:** [RETURN METHOD: to be filled in by the coordinator].
**Questions or technical problems:** contact [CONTACT: to be filled in by the coordinator].
*(Provisional: keep the file name you received unchanged.)*

**Saving correctly in Excel** (practical tips):
- Use **File → Save As** and choose **"CSV UTF-8 (Comma delimited)"** or **"CSV (Comma delimited)"**.
- Then open the saved file in Notepad and check that the first line reads exactly:
  `item_no,query,label,confidence,record_ids,comment`
  If it shows semicolons instead of commas (some regional settings do this), tell the coordinator
  rather than trying to fix it by hand.
- If you edit the file in a text editor instead, do not put commas inside a cell. That is why ids are
  separated by semicolons.

**If something goes wrong** (the file won't open, you lost work, or you entered a wrong label), fix it if
you can: a wrong label can simply be overwritten. Otherwise contact the coordinator and describe the
technical problem. You may add a short note when you return the sheet, but don't comment on individual
requests outside the sheet's `comment` column.

---

## 15. Frequently asked questions

**Do I need to know PowerShell?**
No. The `intent` and `description` columns explain each record in plain words.

**Should I choose the command I would personally use?**
No. Choose the record(s) that perform the readings the words support. Your habit is one reading among
many.

**I know a better command that isn't in the list. Can I use it?**
No. Only records in the list count. If none performs the task, the label is OOD.

**What if the request is vague?**
List the readings the words can support and apply the plausibility test (Section 6, Step 6).

**Does missing detail always mean AMBIGUOUS?**
No. Missing file names, addresses or numbers are placeholders. Only different *tasks* (different effect,
scope or ecosystem) can make a request ambiguous.

**Can I give a request more than one label?**
No. Exactly one label per request.

**What if no command matches?**
Label it OOD and write `none` in `record_ids`.

**What if two commands seem to match?**
Do they do the same thing? Then they are variants: CLEAR, record both. Do they do different things? Then
apply the plausibility test: AMBIGUOUS if both readings are plausible, CLEAR if one dominates.

**What if I'm unsure?**
Pick the label you can defend, choose confidence `1`, and explain briefly in the comment.

**Can I use Google or an AI assistant?**
Not to decide a label, and not to look up where the requests come from.

**Can I ask someone else doing this task?**
No. Don't discuss requests with anyone. Questions about the rules go to the coordinator, and the answer
is shared with everyone.

**Can I take breaks?**
Yes. Save your sheet, and continue later from the first unlabeled row.

**I entered a wrong label. What now?**
Overwrite it before you return the sheet. Don't change labels just to make the overall pattern look
different.

**The sheet stopped working, or I can't save it as CSV.**
Keep a copy of what you have, and contact the coordinator with a description of the problem.

---

## 16. One-page quick reference

**Labels**

| | Meaning | `record_ids` |
|---|---|---|
| **CLEAR** | One plausible task (or one dominant), performed by the list | the performing id(s), with variants |
| **AMBIGUOUS** | 2+ materially different plausible tasks, each performed by the list | ids for each kept reading (2 or more) |
| **OOD** | No record performs the task | `none` |

**Procedure**

1. Read the whole request.
2. List 1–3 readings.
3. Search the list for records that **perform** each one.
4. None → **OOD**. One reading left → **CLEAR**.
5. Two or more left → is the other reading held by about 1 in 5 people, and badly served by the first
   record? **Yes → AMBIGUOUS, no → CLEAR.**
6. Bare name → count distinct tasks: 3+ → AMBIGUOUS, 2 → plausibility test, 1 → CLEAR, 0 → OOD.

**Remember**

- Same effect = variants (one task). Different effect on data, scope or ecosystem = distinct tasks.
- Placeholders may be filled in. Loops, pipes, extra tools, or "every/all" from a single-item record are
  not allowed.
- Judge against the list, not against what a shell could do.
- Never run commands to test anything.

**Confidence:** `1` could easily go the other way · `2` fairly sure · `3` certain. Low confidence is
fine.

**Independence:** work alone; no search engines or AI to decide labels; don't look up the requests'
source; questions about rules only, to the coordinator.

**Before returning:**
- every row labeled, with confidence and ids;
- ids exact and separated by semicolons;
- `item_no` and `query` unchanged, rows in order;
- saved as CSV, with the header line checked in Notepad.
