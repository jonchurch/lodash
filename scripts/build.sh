#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"

# Resolve ref to a SHA so all CLI calls build from the same commit
SHA=$(git ls-remote https://github.com/lodash/lodash.git "$REF" | cut -f1)
if [ -z "$SHA" ]; then
  # Assume it's already a SHA if ls-remote didn't match
  SHA="$REF"
fi

REPO_REF="lodash/lodash#${SHA}"
echo "Building from lodash/lodash @ ${SHA} (ref: ${REF})..."

npx lodash-cli modularize exports=node --repo "$REPO_REF" -o ./  # CJS modules
npx lodash-cli --repo "$REPO_REF" -o ./lodash.js                 # monolith + .min.js
npx lodash-cli core --repo "$REPO_REF" -o ./core.js              # core.js + .min.js

node scripts/build-fp.js                                          # FP wrappers
