# TermAssist Corpus — Controlled Category Vocabulary (Spec §1.3)

The `category` field of every corpus record MUST be one of the entries below. New categories
require adding a row here with a one-line definition before use. No free-text categories.

Seed vocabulary = the 27 categories present in the migrated legacy corpus (counts as of the
schema migration).

| category | count | definition |
|---|---:|---|
| git | 43 | Git version-control operations |
| shell | 38 | Shell built-ins, redirection, pipes, aliases, env vars, job control |
| filesystem | 36 | File/directory creation, copy, move, rename, listing, links |
| system | 32 | OS-level info, services, reboot/shutdown, event logs, host config |
| network | 30 | Interface/IP/DNS/connectivity inspection and configuration |
| process | 29 | Process listing, inspection, signaling, termination |
| docker | 24 | Docker containers, images, volumes, compose |
| find | 20 | Locating files by name/size/time/type |
| grep | 18 | Text search within files/streams (pattern matching) |
| permissions | 18 | File ownership and access-control changes |
| package | 16 | System package managers (winget/apt/brew-style install/remove) |
| npm | 11 | Node.js package management |
| disk | 11 | Disk/volume usage, free space, drive listing |
| curl | 10 | HTTP requests and transfers via curl |
| pip | 10 | Python package management |
| sed | 9 | Stream editing / in-place text transformation |
| terminal | 9 | Terminal-session control (clear, multiplexers) |
| kubernetes | 9 | Kubernetes cluster/pod/resource operations |
| awk | 8 | Column/field text processing |
| encoding | 8 | Base64/hex encode-decode, hashing of file contents |
| jq | 8 | JSON querying and transformation |
| ssh | 7 | Remote shell, key generation, tunneling, scp |
| archive | 6 | Zip/compress-archive and extraction (non-tar) |
| security | 6 | Encryption/decryption, key/cert generation, scanning |
| ffmpeg | 6 | Audio/video transcoding and manipulation |
| tar | 5 | tar/gz archive creation and extraction |
| aws | 4 | AWS CLI (S3/EC2 and related services) |

Note: `tar` intents contain the token `tar.gz`, which the production tokenizer merges into a
single `targz` token — a documented lexical-gap finding (see `v0.2_ADJUDICATION_REPORT.md`). Any
corpus expansion in the tar/archive families should keep this quirk in mind for benchmark design.
