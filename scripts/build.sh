#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

# TODO: change back to lodash/lodash before merging upstream
REPO="jonchurch/lodash"

echo "Fetching lodash.js (ref: $REF)..."
curl -sfL "https://raw.githubusercontent.com/${REPO}/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=npm --source "$SRC" -o ./  # per-method packages
