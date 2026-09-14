// Phase 11 -- rule-based (regex/keyword), fully deterministic command risk classifier.
// LOW / MEDIUM / HIGH / CRITICAL, checked in that priority order (CRITICAL first) so a command
// matching multiple tiers gets its most severe applicable tag. No ML, no LLM -- every rule is
// inspectable and auditable, per the project's "no LLM feature" constraint and the plan's
// requirement that safety be deterministic and never execute anything HIGH/CRITICAL for real.

const CRITICAL_PATTERNS = [
  /\brm\s+-rf\s+\/(\s|$)/i,              // rm -rf / (root wipe)
  /\bformat\b/i,                          // disk formatting
  /\bmkfs(\.\w+)?\b/i,                    // filesystem creation (destroys existing data)
  /\bdd\s+.*\bof=\/dev\//i,               // raw disk write
  /Remove-Item\s+-Recurse\s+-Force/i,     // PowerShell recursive force delete
  /\bsudo\s+reboot\b/i,
  /\bsudo\s+shutdown\b/i,
  /\bshutdown\s+(-h|-r|\/s|\/r)\b/i,
  /-Verb\s+RunAs/i,                       // privilege escalation launch
  /\bdiskpart\b/i,
  /chmod\s+-R\s+777/i,
  /\bDROP\s+(DATABASE|TABLE)\b/i,
  /Format-Volume/i,
  /:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;/  // fork bomb pattern
];

const HIGH_PATTERNS = [
  /git\s+reset\s+--hard/i,
  /git\s+clean\s+-f/i,
  /git\s+branch\s+-D\b/i,
  /git\s+rebase\s+-i\b/i,                 // history rewrite, hang-risk if run for real
  /docker\s+(system|volume|image)\s+prune/i,
  /docker\s+stop\s+\$\(docker\s+ps/i,     // stops ALL containers
  /kubectl\s+delete\b/i,
  /icacls\b.*\/setowner/i,
  /New-NetFirewallRule/i,
  /Rename-Computer/i,
  /winget\s+uninstall\b.*--purge/i,
  /\bkill\s+-9\b/i,
  /\bpkill\b/i,
  /\bsudo\b/i                              // any other sudo-prefixed command not already CRITICAL
];

const MEDIUM_PATTERNS = [
  /git\s+checkout\s+--\s+\./i,            // discards uncommitted working changes
  /\bmv\b/i, /Move-Item/i, /Rename-Item/i,
  /npm\s+uninstall/i,
  /\b(apt|yum|dnf|brew)\s+(remove|uninstall)/i,
  /git\s+push\s+.*--force/i,
  /\bchmod\b/i,                            // non-recursive permission change
  /Remove-Item\b(?!.*-Recurse)/i,          // single-item delete without recurse
  /\brm\b(?!\s+-rf)/i                      // rm without -rf
];

function classify(command) {
  if (!command) return { tier: 'LOW', matched_rule: null };
  for (const p of CRITICAL_PATTERNS) if (p.test(command)) return { tier: 'CRITICAL', matched_rule: p.source };
  for (const p of HIGH_PATTERNS) if (p.test(command)) return { tier: 'HIGH', matched_rule: p.source };
  for (const p of MEDIUM_PATTERNS) if (p.test(command)) return { tier: 'MEDIUM', matched_rule: p.source };
  return { tier: 'LOW', matched_rule: null };
}

module.exports = { classify, CRITICAL_PATTERNS, HIGH_PATTERNS, MEDIUM_PATTERNS };
