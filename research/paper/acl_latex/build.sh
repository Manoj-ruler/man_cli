#!/usr/bin/env bash
# Rebuilds main.pdf (final/camera-ready) and main_review.pdf (anonymized review) from source.
# Both share content.tex, so editing that file and rerunning this script keeps them in sync.
# Requires a LaTeX distribution (MiKTeX/TeX Live) with pdflatex and bibtex on PATH.
# Run from this directory.
set -e
for base in main main_review; do
  pdflatex -interaction=nonstopmode -halt-on-error "$base.tex"
  bibtex "$base"
  pdflatex -interaction=nonstopmode -halt-on-error "$base.tex"
  pdflatex -interaction=nonstopmode -halt-on-error "$base.tex"
done
echo "Built main.pdf and main_review.pdf"
