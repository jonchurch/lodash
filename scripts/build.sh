#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

echo "Fetching lodash.js (ref: $REF)..."
curl -sfL "https://raw.githubusercontent.com/lodash/lodash/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=es --source "$SRC" -o ./
