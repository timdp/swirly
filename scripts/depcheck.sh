#!/bin/bash

set -e

SELF=$0
DIRNAME=$( dirname "$SELF" )
ROOT=$DIRNAME/..
DEPCHECK=$ROOT/node_modules/.bin/depcheck

if [[ $# = 0 ]]; then
  find "$ROOT/packages" -mindepth 1 -maxdepth 1 -type d -print0 |
    xargs -0 -n 1 -P 8 "$SELF"
  exit $?
fi

erroneous=0
for pkgdir in "$@"; do
  pkgname=$( basename "$pkgdir" )
  missing=$( "$DEPCHECK" "$pkgdir" --json --ignore-dirs=dist | jq -r '.missing | keys | join(" ")' )
  if [[ -n $missing ]]; then
    printf '%-32s %s\n' "$pkgname" "$missing" >&2
    (( erroneous++ ))
  fi
done

exit $erroneous
