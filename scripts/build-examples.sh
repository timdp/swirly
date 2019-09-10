#!/bin/bash

set -eo pipefail

cd examples

for input in *.txt; do
  output=${input/.txt/.svg}
  echo "$input -> $output"
  node ../bin/cli -f "$input" "$output"
done
