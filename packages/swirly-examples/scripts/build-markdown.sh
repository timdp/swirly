#!/bin/bash

set -euo pipefail

SELF=$0
DIRNAME=$(dirname "$SELF")

cd "$DIRNAME/../../../examples"

echo "Rendering examples.md"

{
  echo '# Examples'
  echo
  for file in *.txt; do
    name=$(basename "$file" .txt)
    echo "## $name"
    echo
    echo "[Spec](examples/$name.txt)"
    echo '·'
    echo "[PNG](examples/$name.png)"
    echo '·'
    echo "[SVG](examples/$name.svg)"
    echo
    echo "![$name](examples/$name.png)"
    echo
    echo '```'
    cat "$file"
    echo '```'
    echo
  done
} >../examples.md

echo "Successfully rendered examples.md"
