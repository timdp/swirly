#!/bin/bash

set -eo pipefail

SELF=$0
DIRNAME=$(dirname "$SELF")
ROOT=$DIRNAME/..
DEPCHECK=$ROOT/node_modules/.bin/depcheck
IGNORE_UNUSED=''

GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
RESET=$(tput sgr0)

if [[ $# == 0 ]]; then
  find "$ROOT/packages" -mindepth 1 -maxdepth 1 -type d -print0 |
    xargs -0 -n 1 -P 8 "$SELF"
  exit $?
fi

erroneous=0
for pkgdir in "$@"; do
  pkgname=$(basename "$pkgdir")

  # TODO Make configurable
  if [[ $pkgname == swirly-examples ]]; then
    continue
  fi

  result=$($DEPCHECK "$pkgdir" --ignore-patterns=dist/ --json || true)

  unused=$(
    comm -23 \
      <(
        echo "$result" |
          jq -r '.dependencies | join(" ")' |
          xargs -n1 |
          sort
      ) \
      <(
        echo "$IGNORE_UNUSED" |
          xargs -n1 |
          sort
      ) |
      xargs
  )
  if [[ -n $unused ]]; then
    echo -n "$YELLOW"
    printf 'unused:  %-32s %s\n' "$pkgname" "$unused" >&1
    echo -n "$RESET"
    ((++erroneous))
  fi

  missing=$(
    echo "$result" |
      jq -r '.missing | keys | join(" ")' |
      xargs -n1 |
      sort |
      xargs
  )
  if [[ -n $missing ]]; then
    echo -n "$GREEN"
    printf 'missing: %-32s %s\n' "$pkgname" "$missing" >&2
    echo -n "$RESET"
    ((++erroneous))
  fi
done

exit $erroneous
