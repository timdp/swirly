#!/bin/bash

set -euo pipefail

SERVER_PORT=13484
SERVER_URL="http://127.0.0.1:$SERVER_PORT"
MAX_PROBES=10

echo "Starting server at $SERVER_URL"

node packages/swirly-rasterization-server/dist/cli -p $SERVER_PORT >/dev/null &
SERVER_PID=$!

echo "Server started, PID is $SERVER_PID"

kill_server () {
  echo "Killing server with PID $SERVER_PID"
  kill $SERVER_PID
}

trap kill_server exit

probes=0
while ! curl -sf "$SERVER_URL" >/dev/null; do
  if (( ++probes >= MAX_PROBES )); then
    echo "Server at $SERVER_URL unreachable after $MAX_PROBES attempts" >&2
    exit 1
  fi
  sleep 1
done

echo "Server ready, rendering examples"

cd examples

for input in *.txt; do
  for ext in svg png; do
    output=${input/.txt/.$ext}
    echo "$input" "$output"
  done
done | xargs -r -t -n2 -P4 \
  node ../packages/swirly/dist/cli \
    --rasterization-server "$SERVER_URL" \
    --force \
    --optimize \
    --scale 200

echo "Successfully rendered examples"
