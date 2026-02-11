# Lodash v4 — Build Automation Plan

> Minimal changes to make the v4 build/release process self-describing, reproducible, and automatable. Phased so each phase delivers value independently.

## Phase 1 — Usable CLI + Build Scripts (unblocks releases)

Get the existing CLI into a usable state with a sane interface. Doesn't solve mapping staleness — the bundled mapping is correct for v4.17.23 and only goes stale when function deps change (rare). Solves: tribal knowledge, orphaned tooling, backwards interface.

### 1.1 Unarchive lodash-cli

Unarchive `lodash/lodash-cli` on GitHub. Merge Ben Tan's 5 commits from `bnjmnt4n/lodash-cli` (mapping updates for 4.17.20/21, template fix).

**Effort**: Admin action + one merge.

### 1.2 Patch CLI with `--source`

One new flag: **`--source <path>`** — path to a `lodash.js` file to build from, replacing `require.resolve('lodash')` (line 2105 of `bin/lodash`).

```bash
lodash modularize exports=node --source /path/to/lodash.js -o ./out/
lodash core --source /tmp/lodash-src/lodash.js -o ./core.js
```

If not provided, falls back to `require.resolve('lodash')` (i.e. `node_modules/lodash/`) for backwards compat.

The CLI only needs the single `lodash.js` file — verified by reading the source. It gets the version string by executing `lodash.js` in a VM and reading `_.VERSION` (line 3043-3050). No `package.json` or directory structure required.

**Effort**: ~5 lines. One PR to lodash-cli. Just swap `require.resolve('lodash')` for the provided path when `--source` is set.

**Future**: A `--ref` flag that fetches source from GitHub and embeds the ref in build headers (self-documenting, reproducible) is a natural follow-on. Deferred because build.sh can handle ref resolution for now, and `--source` is the smallest useful change to the CLI.

### 1.3 Add build scripts to distribution branches

Each dist branch gets a `build.sh` and a `package.json` build script. The build.sh fetches `lodash.js` from GitHub via raw URL (`https://raw.githubusercontent.com/lodash/lodash/{ref}/lodash.js`) and passes it to each CLI call via `--source`. The CLI stays dumb — it builds from a file path. The shell script handles orchestration.

**npm branch** — three CLI calls + FP:

```json
{ "scripts": { "build": "bash build.sh" } }
```

```bash
#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

curl -sfL "https://raw.githubusercontent.com/lodash/lodash/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=node --source "$SRC" -o ./  # ~628 CJS modules
npx lodash-cli --source "$SRC" -o ./lodash.js                 # monolith + .min.js
npx lodash-cli core --source "$SRC" -o ./core.js              # core.js + .min.js
node build-fp.js                                               # ~415 FP wrappers
```

**es branch** — one CLI call:

```bash
#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

curl -sfL "https://raw.githubusercontent.com/lodash/lodash/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=es --source "$SRC" -o ./    # ~640 ES modules
```

**amd branch** — two CLI calls:

```bash
#!/usr/bin/env bash
set -euo pipefail

REF="${1:-main}"
SRC=$(mktemp)
trap "rm -f $SRC" EXIT

curl -sfL "https://raw.githubusercontent.com/lodash/lodash/${REF}/lodash.js" -o "$SRC"

npx lodash-cli modularize exports=amd --source "$SRC" -o ./   # ~638 AMD modules
npx lodash-cli exports=amd -d --source "$SRC" -o ./main.js    # monolith in AMD wrapper
```

Usage (any branch):
```bash
npm run build                       # builds from HEAD of main
npm run build -- 4.17.24            # builds from a tag
npm run build -- abc123f            # builds from a SHA
```

**Note**: Tags in `lodash/lodash` have no `v` prefix — they're `4.17.23`, not `v4.17.23`. Dist branch tags are suffixed: `4.17.23-npm`, `4.17.23-es`, `4.17.23-amd`.

`lodash-cli` is a devDependency on each branch. The fetch preamble is ~3 lines, duplicated across branches (simple enough not to abstract).

**Effort**: One commit per dist branch. Each gets a build.sh (~10-15 lines). Npm also has build-fp.js (already exists on that branch).

**Limitation**: The CLI's bundled mapping.js must match the source's dep graph. If you change deps in lodash.js without updating the CLI's mapping, modular builds silently break. Phase 3 eliminates this risk.

### Phase 1 delivers

- A maintained, hackable build tool with a sane `--source` interface
- `npm run build -- v4.17.24` on any dist branch — ref as the primary interface
- No local git repo dependency for builds — works from anywhere with network
- No tribal knowledge — the build process is in source
- Releases can ship using the existing CLI

---

## Phase 2 — CI Workflows (automation)

### 2.1 Build verification on PR to main

Lives on main. Trigger: `pull_request`.

Steps: check out PR, install CLI, run all build modes, validate output (file counts, key files, syntax). Report pass/fail. Does NOT commit anything.

### 2.2 Per-branch build workflow

Lives on each dist branch (npm, es, amd). Trigger: `workflow_dispatch` with `source_ref` input.

Steps: check out branch, install deps, run `npm run build -- <source_ref>`, run tests (see unresolved), commit, push.

Each branch builds itself, tests itself, commits to itself. Failures isolated.

Two use cases:
- **Tag push** (via dispatcher, 2.3) → release build. Version from tag, version bumps in package.json/README.
- **Manual dispatch** → refresh/verify. No version ceremony, no tag needed.

### 2.3 Tag-triggered dispatcher

Lives on main. Trigger: tag push matching `v4.*`.

Dispatches each branch's build workflow with the tag as source_ref. This is the only workflow on main that touches dist branches, and all it does is trigger — no build logic.

Note: GitHub Actions runs tag-triggered workflows from the tagged commit, so only main's workflows see the event. The dispatcher bridges this by dispatching to each branch's workflow via `workflow_dispatch`.

Tags should be immutable. `workflow_dispatch` covers testing needs without consuming version numbers. Prerelease tags (`v4.17.24-rc.1`) available if needed to test the full tag pipeline.

### Phase 2 delivers

- Push a tag, walk away — dist branches update themselves
- PRs to main get build verification
- Manual rebuild/refresh anytime via dispatch

---

## Phase 3 — Mapping Generator (eliminates manual mapping)

Auto-derive the dependency graph from lodash.js. Eliminates mapping.js maintenance and makes the ref-based approach fully reproducible — the source alone determines the build output.

### 3.1 Build the mapping generator

A standalone script that reads lodash.js and produces mapping.js (same format the CLI already consumes). Extracts funcDep, varDep, aliasToReal, and category from the source via static analysis.

```bash
node scripts/generate-mapping.js lodash.js > mapping.js
```

**Approach**: Use acorn (ES5 parser) to walk the AST. For each function, collect Identifier references that match other known function/variable names. Aliases from the `lodash.xxx = yyy` assignments. Categories from JSDoc `@category` tags.

**Effort**: ~200 lines. Validate by diffing output against the existing hand-maintained mapping.js — if they match, the generator is correct.

### 3.2 Wire mapping into the CLI

Add a `--mapping <path>` flag to the CLI. When provided, use that mapping.js instead of the bundled copy. Build scripts update to fetch `mapping.js` alongside `lodash.js` from the same ref and pass both via `--source` and `--mapping`.

**Effort**: ~10-line patch.

### 3.3 Commit generated mapping on main

The generator lives on main. Run it, commit the output as `mapping.js` on main. CI can verify freshness: run generator, diff against committed mapping, fail if stale.

Build scripts fetch it alongside lodash.js from the same ref.

### Phase 3 delivers

- No manual mapping.js maintenance
- Same source → same output regardless of CLI version
- CI can verify mapping freshness (run generator, diff against committed)
- Safe to make non-trivial changes to lodash v4 without fear of stale mappings

---

## Phase 4 — Modern Build Tool (parallel workstream)

Replace the regex-based CLI with an AST-based tool. Can start anytime after phase 1, doesn't block anything. If started early enough, may make phase 3 unnecessary (dep derivation is built into the new tool).

### Why

3400 lines of regex extraction is opaque, fragile if formatting changes, and maintained by nobody who wrote it. A modern rewrite in ~500 lines with acorn would be more robust, more maintainable, and owned by the current team.

### What

- Parse lodash.js with acorn (ES5 parser, tiny, zero deps)
- Walk AST to extract functions (~50 lines vs 20 regex patterns)
- Derive deps from AST (subsumes the mapping generator from phase 3)
- Generate CJS/ES/AMD output files with correct imports/exports
- Minify with terser (replaces uglify 2.x + closure compiler + Java)
- Handle runInContext removal via AST surgery

### Validation

Build with both old CLI and new tool, diff all output files. If identical, the new tool is correct. The existing CLI is the test oracle.

### Phase 4 delivers

- A build tool the team owns and understands
- No Java dependency
- Robust against formatting changes
- Mapping generation built-in (no separate step)
- ~500 lines replacing ~3400

---

## Unresolved: Testing Built Output

Each dist branch's workflow (2.2) should test before committing. What those tests look like is open.

Options:

**A. Run main's test suite against the built package** — install built output, run existing tests. The npm package ships the monolith as lodash.js, so the full suite should pass unchanged.

**B. Modular import tests** — `require('lodash/map')` etc. for all ~300 public functions. Verify each loads and returns a function. Auto-generated from function list. Catches missing deps.

**C. Full test suite against modular imports** — most thorough, highest effort.

**D. Subset integration tests** — exercise deep dep trees (template, merge, cloneDeep) against modular build.

Recommendation: Start with A + B. Consider C/D later.

---

## Sequence

```
Phase 1 (unblocks releases):
  1.1 Unarchive CLI                ─── admin, no code
  1.2 Patch CLI (--source)         ─── ~5 lines, one PR to CLI
  1.3 Build scripts on dist        ─── one commit per branch, each gets build.sh
          │
          ├──→ Phase 2 (automation):                  ──→ the 80%
          │      2.1 PR build verification             ─── workflow on main
          │      2.2 Per-branch build workflow          ─── workflow on each dist branch
          │      2.3 Tag dispatcher                    ─── workflow on main
          │
          └──→ Phase 3 (eliminates mapping risk):     ──→ safety net
                 3.1 Build mapping generator           ─── ~200 lines, validate against existing
                 3.2 Patch CLI (--mapping flag)         ─── ~10-line PR
                 3.3 Commit mapping on main             ─── fetched alongside lodash.js by build.sh

Phase 4 (parallel, not blocking — can start anytime after phase 1):
  Modern build tool rewrite        ─── ~500 lines, validated against old CLI
                                       subsumes phase 3 if done first
```

Phase 1 + Phase 2 is the 80% — a functioning, automated release pipeline. Phase 3 is insurance against stale mappings (rare for v4 but dangerous when it happens). Phase 4 runs in parallel whenever there's appetite — if it lands before phase 3, skip phase 3 entirely.

## Non-Goals for v4

- Monorepo / workspaces restructuring
- Changing the monolith source format
- Auto-publishing (initially — add later once confidence is high)
