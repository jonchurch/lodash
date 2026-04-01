#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
REPO="lodash/lodash"

echo "Fetching lodash.js ($REPO#$REF)..."

npx lodash-cli modularize exports=amd --repo "$REPO#$REF" -o ./   # AMD modules
npx lodash-cli exports=amd -d --repo "$REPO#$REF" -o ./main.js    # monolith in AMD wrapper
