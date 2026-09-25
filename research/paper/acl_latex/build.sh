#!/usr/bin/env bash
# Rebuilds main.pdf from source. Requires a LaTeX distribution (MiKTeX/TeX Live) with pdflatex
# and bibtex on PATH. Run from this directory.
set -e
pdflatex -interaction=nonstopmode -halt-on-error main.tex
bibtex main
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
echo "Built main.pdf"
