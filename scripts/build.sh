#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

echo "Fetching lodash.js (ref: $REF)..."
curl -sfL "https://raw.githubusercontent.com/lodash/lodash/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=node --source "$SRC" -o ./  # ~628 CJS modules
npx lodash-cli --source "$SRC" -o ./lodash.js                 # monolith + .min.js
npx lodash-cli core --source "$SRC" -o ./core.js              # core.js + .min.js

# TODO: FP module generation (~415 wrappers)
# The FP build script (lib/fp/build-modules.js) lives on main and has
# dependencies on lib/common/*. Needs to be made standalone or fetched
# alongside lodash.js before it can run here.
