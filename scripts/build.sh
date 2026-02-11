#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

echo "Fetching lodash.js (ref: $REF)..."
curl -sfL "https://raw.githubusercontent.com/lodash/lodash/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=node --source "$SRC" -o ./  # CJS modules
npx lodash-cli --source "$SRC" -o ./lodash.js                 # monolith + .min.js
npx lodash-cli core --source "$SRC" -o ./core.js              # core.js + .min.js

node scripts/build-fp.js                                      # FP wrappers
