#!/bin/bash

set -eo pipefail

cd examples

for input in *.txt; do
  for ext in svg png; do
    output=${input/.txt/.$ext}
    echo "$input" "$output"
  done
done | xargs -t -n2 -P4 node ../packages/swirly/bin/swirly -f -o -z 200
