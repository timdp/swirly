#!/bin/bash

set -euo pipefail

SELF=$0
DIRNAME=$(dirname "$SELF")

"$DIRNAME/build-tsconfig.js"
yarn run clean
tsc
