#!/usr/bin/env bash
# Rebuilds main.pdf (final/camera-ready) and main_review.pdf (anonymized review) from source.
# Both share content.tex, so editing that file and rerunning this script keeps them in sync.
# Requires a LaTeX distribution (MiKTeX/TeX Live) with pdflatex and bibtex on PATH.
# Run from this directory.
#
# Also enforces the ACL/EACL SRW long-paper body limit: the page holding the \label{endofbody}
# marker at the end of content.tex (just before the bibliography) must be <= BODY_LIMIT. The
# bibliography and appendices come after it and are not counted.
set -e
BODY_LIMIT=8
for base in main main_review; do
  pdflatex -interaction=nonstopmode -halt-on-error "$base.tex"
  bibtex "$base"
  pdflatex -interaction=nonstopmode -halt-on-error "$base.tex"
  pdflatex -interaction=nonstopmode -halt-on-error "$base.tex"
  pg=$(grep -o 'newlabel{endofbody}{{[^}]*}{[0-9]*}' "$base.aux" | grep -o '{[0-9]*}$' | tr -d '{}')
  echo "$base: body text ends on page $pg (limit $BODY_LIMIT)"
  if [ "$pg" -gt "$BODY_LIMIT" ]; then echo "OVER THE PAGE LIMIT: $base"; exit 1; fi
done
echo "Built main.pdf and main_review.pdf"
