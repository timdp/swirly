#!/bin/bash

set -eo pipefail

cd examples

for input in *.txt; do
  for ext in svg png; do
    output=${input/.txt/.$ext}
    echo "$input -> $output"
    node ../bin/cli -f --scale=400 "$input" "$output"
  done
done
