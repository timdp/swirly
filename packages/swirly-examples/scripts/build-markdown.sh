#!/bin/bash

set -euo pipefail

SELF=$0
DIRNAME=$(dirname "$SELF")

cd "$DIRNAME/../../../examples"

echo "Rendering examples.md"

{
  names=$(basename -a -s .txt *.txt)
  echo '# Examples'
  echo
  sep=0
  for name in $names; do
    if (( sep == 1 )); then
      echo '·'
    else
      sep=1
    fi
    echo "[$name](#${name,,})"
  done
  echo
  for name in $names; do
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
    cat "$name.txt"
    echo '```'
    echo
  done
} >../examples.md

echo "Successfully rendered examples.md"
