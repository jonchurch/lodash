#!/usr/bin/env bash
#
# release-build.sh — Generate lodash distribution builds and commit to branches.
#
# Takes the monolithic lodash.js on main and uses lodash-cli to produce all
# distribution outputs (modular CJS, ES, AMD, core, minified, FP wrappers),
# then commits them to the npm, es, and amd branches via git worktrees.
#
# Usage:
#   scripts/release-build.sh [--dry-run] [--version X.Y.Z] [--lodash-cli /path/to/lodash-cli]
#
# Prerequisites:
#   - lodash-cli cloned and installed:
#       git clone https://github.com/lodash/lodash-cli /path/to/lodash-cli
#       cd /path/to/lodash-cli && npm install --production
#   - npm dependencies installed in this repo (for FP module generation):
#       npm install
#
set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DRY_RUN=false
SKIP_CLEAN_CHECK=false
KEEP_BRANCHES=false
VERSION=""
CLI_DIR="${LODASH_CLI_DIR:-}"
STAGE=""
WORK=""

# ── Argument parsing ─────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --version)
      VERSION="$2"
      shift 2
      ;;
    --lodash-cli)
      CLI_DIR="$2"
      shift 2
      ;;
    --no-clean-check)
      SKIP_CLEAN_CHECK=true
      shift
      ;;
    -h|--help)
      sed -n '2,/^$/s/^# //p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────────────

die() {
  echo "ERROR: $*" >&2
  exit 1
}

log() {
  echo "==> $*"
}

cleanup() {
  if [[ -n "$WORK" && -d "$WORK" ]]; then
    log "Cleaning up worktrees..."
    for branch in npm es amd; do
      git -C "$REPO_ROOT" worktree remove --force "$WORK/$branch" 2>/dev/null || true
    done
    rm -rf "$WORK"
  fi
  # Delete PR branches unless a successful commit was made
  if [[ "$KEEP_BRANCHES" == false ]] && [[ -n "$VERSION" ]]; then
    for branch in npm es amd; do
      git -C "$REPO_ROOT" branch -D "release-automation/$VERSION-$branch" 2>/dev/null || true
    done
  fi
  if [[ -n "$STAGE" && -d "$STAGE" ]]; then
    rm -rf "$STAGE"
  fi
}

trap cleanup EXIT

lodash_cli() {
  node "$CLI_DIR/bin/lodash" "$@"
}

count_js_files() {
  find "$1" -maxdepth 1 -name '*.js' | wc -l | tr -d ' '
}

# ── Phase 0: Validate ───────────────────────────────────────────────────────

log "Phase 0: Validating..."

# Check lodash-cli path
if [[ -z "$CLI_DIR" ]]; then
  die "lodash-cli path required. Set LODASH_CLI_DIR or pass --lodash-cli /path/to/lodash-cli"
fi
if [[ ! -f "$CLI_DIR/bin/lodash" ]]; then
  die "lodash-cli not found at $CLI_DIR/bin/lodash"
fi

# Check repo state
cd "$REPO_ROOT"
if [[ "$SKIP_CLEAN_CHECK" == false ]] && [[ -n "$(git status --porcelain)" ]]; then
  die "Working directory is not clean. Commit or stash changes first. (Use --no-clean-check to skip)"
fi

# Extract version from lodash.js
SOURCE_VERSION=$(grep -m1 "var VERSION = '" lodash.js | sed "s/.*var VERSION = '//;s/'.*//" )
if [[ -z "$SOURCE_VERSION" ]]; then
  die "Could not extract VERSION from lodash.js"
fi

if [[ -z "$VERSION" ]]; then
  VERSION="$SOURCE_VERSION"
  log "Using version from lodash.js: $VERSION"
elif [[ "$VERSION" != "$SOURCE_VERSION" ]]; then
  die "Requested version $VERSION does not match lodash.js VERSION ($SOURCE_VERSION). Update lodash.js first."
fi

# Check PR branches don't already exist
for suffix in npm es amd; do
  pr_branch="release-automation/$VERSION-$suffix"
  if git rev-parse "$pr_branch" >/dev/null 2>&1; then
    die "Branch $pr_branch already exists. Delete it first or use a different version."
  fi
done

# Check distribution branches exist
for branch in npm es amd; do
  if ! git rev-parse "upstream/$branch" >/dev/null 2>&1; then
    # Fall back to origin if upstream doesn't exist
    if ! git rev-parse "origin/$branch" >/dev/null 2>&1; then
      die "Neither upstream/$branch nor origin/$branch exists. Fetch first."
    fi
  fi
done

# Copy lodash source into lodash-cli's node_modules
log "Copying lodash.js into lodash-cli..."
mkdir -p "$CLI_DIR/node_modules/lodash"
cp lodash.js "$CLI_DIR/node_modules/lodash/lodash.js"
cp package.json "$CLI_DIR/node_modules/lodash/package.json"

log "Version: $VERSION"
log "lodash-cli: $CLI_DIR"
log "Dry run: $DRY_RUN"

# ── Phase 1: Generate outputs ───────────────────────────────────────────────

log "Phase 1: Generating distribution outputs..."

STAGE=$(mktemp -d)
log "Staging directory: $STAGE"

# ── npm branch: modular CJS + monolith + core + FP ──

log "  Generating CJS modules (npm branch)..."
lodash_cli modularize exports=node -o "$STAGE/npm/" \
  || die "lodash-cli modularize exports=node failed"

# Build monolith and core into a temp subdir to avoid .min.min.js artifacts.
# lodash-cli always writes unminified to the -o path; without -d, it also
# creates a .min.js companion alongside it.
mkdir -p "$STAGE/builds"

log "  Generating lodash.min.js..."
lodash_cli -o "$STAGE/builds/lodash.js" \
  || die "lodash-cli minify failed"

log "  Generating core.js + core.min.js..."
lodash_cli core -o "$STAGE/builds/core.js" \
  || die "lodash-cli core failed"

# Assemble npm branch files: raw monolith + minified + core builds
cp lodash.js "$STAGE/npm/lodash.js"
cp "$STAGE/builds/lodash.min.js" "$STAGE/npm/lodash.min.js"
cp "$STAGE/builds/core.js" "$STAGE/npm/core.js"
cp "$STAGE/builds/core.min.js" "$STAGE/npm/core.min.js"

log "  Generating FP modules..."
node "$REPO_ROOT/lib/fp/build-modules.js" "$STAGE/npm/" \
  || die "FP module generation failed"

# ── es branch: modularize only ──

log "  Generating ES modules (es branch)..."
lodash_cli modularize exports=es -o "$STAGE/es/" \
  || die "lodash-cli modularize exports=es failed"

# ── amd branch: modularize + AMD-wrapped monolith ──

log "  Generating AMD modules (amd branch)..."
lodash_cli modularize exports=amd -o "$STAGE/amd/" \
  || die "lodash-cli modularize exports=amd failed"

log "  Generating AMD monolith (main.js)..."
lodash_cli exports=amd -d -o "$STAGE/amd/main.js" \
  || die "lodash-cli AMD monolith failed"

# ── Validate outputs ──

log "  Validating outputs..."

npm_count=$(count_js_files "$STAGE/npm")
es_count=$(count_js_files "$STAGE/es")
amd_count=$(count_js_files "$STAGE/amd")

[[ "$npm_count" -ge 600 ]] || die "npm: only $npm_count .js files (expected ≥600)"
[[ "$es_count" -ge 600 ]]  || die "es: only $es_count .js files (expected ≥600)"
[[ "$amd_count" -ge 600 ]] || die "amd: only $amd_count .js files (expected ≥600)"

# npm-specific checks
[[ -f "$STAGE/npm/lodash.js" ]]     || die "npm: lodash.js missing"
[[ -f "$STAGE/npm/lodash.min.js" ]] || die "npm: lodash.min.js missing"
[[ -f "$STAGE/npm/core.js" ]]       || die "npm: core.js missing"
[[ -f "$STAGE/npm/core.min.js" ]]   || die "npm: core.min.js missing"
[[ -f "$STAGE/npm/fp.js" ]]         || die "npm: fp.js missing"
[[ -d "$STAGE/npm/fp" ]]            || die "npm: fp/ directory missing"

fp_count=$(count_js_files "$STAGE/npm/fp")
[[ "$fp_count" -ge 400 ]] || die "npm: only $fp_count FP files (expected ≥400)"

# es-specific checks
[[ -f "$STAGE/es/lodash.js" ]]         || die "es: lodash.js missing"
[[ -f "$STAGE/es/lodash.default.js" ]] || die "es: lodash.default.js missing"

# amd-specific checks
[[ -f "$STAGE/amd/main.js" ]] || die "amd: main.js missing"

log "  Validation passed: npm=$npm_count modules + $fp_count FP, es=$es_count modules, amd=$amd_count modules"

# ── Phase 2: Assemble worktrees ─────────────────────────────────────────────

log "Phase 2: Assembling worktrees..."

WORK=$(mktemp -d)

# Determine remote name for each branch
get_branch_ref() {
  local branch="$1"
  if git rev-parse "upstream/$branch" >/dev/null 2>&1; then
    echo "upstream/$branch"
  else
    echo "origin/$branch"
  fi
}

for branch in npm es amd; do
  ref=$(get_branch_ref "$branch")
  pr_branch="release-automation/$VERSION-$branch"
  log "  Creating worktree for $branch (branch: $pr_branch) from $ref..."
  git worktree add -b "$pr_branch" "$WORK/$branch" "$ref" 2>/dev/null \
    || die "Failed to create worktree for $branch. Does branch '$pr_branch' already exist?"
done

# ── Populate each worktree ──

populate_branch() {
  local branch="$1"
  local workdir="$WORK/$branch"
  local stagedir="$STAGE/$branch"

  log "  Populating $branch branch..."

  # Remove existing .js files (but not .git*, LICENSE, README, package.json, etc.)
  find "$workdir" -maxdepth 1 -name '*.js' -delete

  # Remove fp/ directory if present (npm branch)
  rm -rf "$workdir/fp"

  # Copy generated files
  cp "$stagedir/"*.js "$workdir/"
  if [[ -d "$stagedir/fp" ]]; then
    cp -R "$stagedir/fp" "$workdir/fp"
  fi

  # Update version in package.json
  local pkg="$workdir/package.json"
  if [[ -f "$pkg" ]]; then
    local old_version
    old_version=$(grep -o '"version": "[^"]*"' "$pkg" | head -1 | sed 's/"version": "//;s/"//')
    # Use a temp file for portability (BSD vs GNU sed)
    local tmpfile
    tmpfile=$(mktemp)
    sed "s/\"version\": \"$old_version\"/\"version\": \"$VERSION\"/" "$pkg" > "$tmpfile"
    mv "$tmpfile" "$pkg"
  fi

  # Update version in README.md
  local readme="$workdir/README.md"
  if [[ -f "$readme" ]]; then
    local tmpfile
    tmpfile=$(mktemp)
    # Update version in header line (e.g., "# lodash v4.17.23" -> "# lodash v4.17.24")
    sed -E "s/(# lodash[^ ]* v)[0-9]+\.[0-9]+\.[0-9]+/\1$VERSION/" "$readme" > "$tmpfile"
    mv "$tmpfile" "$readme"
  fi
}

populate_branch npm
populate_branch es
populate_branch amd

# ── Phase 3: Commit & tag ───────────────────────────────────────────────────

BEFORE_NPM=$(git -C "$WORK/npm" rev-parse --short HEAD)
BEFORE_ES=$(git -C "$WORK/es" rev-parse --short HEAD)
BEFORE_AMD=$(git -C "$WORK/amd" rev-parse --short HEAD)

if [[ "$DRY_RUN" == true ]]; then
  log "Phase 3: Dry run — showing changes (no commits)..."
  for branch in npm es amd; do
    echo ""
    echo "── $branch branch (PR: release-automation/$VERSION-$branch) ──"
    git -C "$WORK/$branch" add -A
    git -C "$WORK/$branch" diff --cached --stat
  done
  echo ""
  log "DRY RUN complete. No commits or branches created."
else
  log "Phase 3: Committing to PR branches..."
  for branch in npm es amd; do
    git -C "$WORK/$branch" add -A

    if git -C "$WORK/$branch" diff --cached --quiet; then
      log "  $branch: no changes — skipping"
    else
      git -C "$WORK/$branch" commit -m "$(cat <<EOF
Bump to v$VERSION
EOF
      )"
      log "  $branch: committed on release-automation/$VERSION-$branch"
    fi
  done
  KEEP_BRANCHES=true
fi

# ── Phase 4: Summary ────────────────────────────────────────────────────────

echo ""
echo "========================================"
if [[ "$DRY_RUN" == true ]]; then
  echo "  Release Build (DRY RUN)"
else
  echo "  Release Build Complete"
fi
echo "========================================"
echo ""
echo "Version: $VERSION"
echo ""

if [[ "$DRY_RUN" == false ]]; then
  echo "PR branches created:"
  for branch in npm es amd; do
    after=$(git -C "$WORK/$branch" rev-parse --short HEAD)
    case "$branch" in
      npm) before="$BEFORE_NPM" ;;
      es)  before="$BEFORE_ES" ;;
      amd) before="$BEFORE_AMD" ;;
    esac
    if [[ "$before" == "$after" ]]; then
      echo "  release-automation/$VERSION-$branch   (no changes)"
    else
      echo "  release-automation/$VERSION-$branch   $before -> $after"
    fi
  done
  echo ""
  echo "Next steps:"
  echo "  1. Review changes:"
  for branch in npm es amd; do
    echo "       git log release-automation/$VERSION-$branch -1 --stat"
  done
  echo ""
  echo "  2. Push PR branches:"
  echo "       git push origin release-automation/$VERSION-npm release-automation/$VERSION-es release-automation/$VERSION-amd"
  echo ""
  echo "  3. Create PRs:"
  echo "       gh pr create --head release-automation/$VERSION-npm --base npm --title \"Bump to v$VERSION\""
  echo "       gh pr create --head release-automation/$VERSION-es --base es --title \"Bump to v$VERSION\""
  echo "       gh pr create --head release-automation/$VERSION-amd --base amd --title \"Bump to v$VERSION\""
  echo ""
  echo "  4. After PRs are merged, tag and publish:"
  echo "       git fetch upstream npm es amd"
  echo "       git tag $VERSION-npm upstream/npm"
  echo "       git tag $VERSION-es upstream/es"
  echo "       git tag $VERSION-amd upstream/amd"
  echo "       git push upstream $VERSION-npm $VERSION-es $VERSION-amd"
  echo ""
  echo "       # Publish lodash"
  echo "       git worktree add /tmp/lodash-publish-npm upstream/npm"
  echo "       cd /tmp/lodash-publish-npm && npm publish"
  echo ""
  echo "       # Publish lodash-es"
  echo "       git worktree add /tmp/lodash-publish-es upstream/es"
  echo "       cd /tmp/lodash-publish-es && npm publish"
fi
