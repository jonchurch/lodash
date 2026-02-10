# Lodash v4 — Build Automation Plan

> Minimal changes to make the v4 build/release process self-describing, reproducible, and automatable. Phased so each phase delivers value independently.

## Phase 1 — Usable CLI + Build Scripts (unblocks releases)

Get the existing CLI into a usable state with a sane interface. Doesn't solve mapping staleness — the bundled mapping is correct for v4.17.23 and only goes stale when function deps change (rare). Solves: tribal knowledge, orphaned tooling, backwards interface.

### 1.1 Unarchive lodash-cli

Unarchive `lodash/lodash-cli` on GitHub. Merge Ben Tan's 5 commits from `bnjmnt4n/lodash-cli` (mapping updates for 4.17.20/21, template fix).

**Effort**: Admin action + one merge.

### 1.2 Patch CLI to accept `--source-dir <path>`

The CLI currently requires lodash source to be installed in its own `node_modules/lodash/`. Patch it to accept `--source-dir /path/to/lodash-repo` — a directory containing `lodash.js`, `package.json`, and anything else the CLI needs. The CLI reads all source inputs from this directory instead of node_modules.

This is a single-flag change. The CLI stays git-unaware — it just reads from a directory. The version string comes from `var VERSION` in lodash.js (or `package.json` in the source dir), no separate `--version` flag needed.

**Effort**: 10-30 lines. One PR to lodash-cli.

**Result**: `lodash modularize exports=node --source-dir /tmp/lodash-checkout -o ./out/`

### 1.3 Add build scripts to distribution branches — commitish support

Each dist branch gets a `build.sh` in its repo and a `"build"` script in `package.json`. The build script accepts a commitish (tag, branch, SHA) or directory path, defaulting to `main`.

The commitish is resolved to a full source tree via `git archive`, which extracts the complete file tree at any ref from within the same repo — no cloning, no network, works from any branch:

```bash
# build.sh (simplified):
SOURCE_REF="${1:-main}"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

if [[ -d "$SOURCE_REF" ]]; then
  # It's a directory path — use directly
  SOURCE_DIR="$SOURCE_REF"
else
  # It's a git ref — extract full source tree
  git archive "$SOURCE_REF" | tar -xC "$TMPDIR"
  SOURCE_DIR="$TMPDIR"
fi

npx lodash-cli modularize exports=node --source-dir "$SOURCE_DIR" -o ./
# ... branch-specific extras (monolith copy, core, FP, minification)
```

Usage:
```bash
npm run build                       # builds from main HEAD
npm run build -- v4.17.24           # builds from a tag
npm run build -- abc123f            # builds from a SHA
npm run build -- /path/to/checkout  # builds from a local directory
```

The build script doesn't need to know which files the CLI needs — it gives it the whole tree. If the CLI later needs something new (mapping.js in phase 3, etc.), the build script doesn't change.

**npm branch** (most involved): modularize CJS + copy raw monolith + minify + core + FP modules (FP generator pulled from the same source tree via `$SOURCE_DIR/lib/fp/build-modules.js`).
**es branch**: modularize ES only.
**amd branch**: modularize AMD + AMD-wrapped monolith.

`lodash-cli` is a devDependency on each branch.

**Effort**: One commit per dist branch.

**Limitation**: The CLI's bundled mapping.js must match the source's dep graph. If you change deps in lodash.js without updating the CLI's mapping, modular builds silently break. Phase 3 eliminates this risk.

### Phase 1 delivers

- A maintained, hackable build tool
- `npm run build -- v4.17.24` on any dist branch — commitish as the primary interface
- No tribal knowledge — the build process is in source
- Releases can ship using the existing CLI

---

## Phase 2 — CI Workflows (automation)

### 2.1 Build verification on PR to main

Lives on main. Trigger: `pull_request`.

Steps: check out PR, install CLI, run all build modes, validate output (file counts, key files, syntax). Report pass/fail. Does NOT commit anything.

### 2.2 Per-branch build workflow

Lives on each dist branch (npm, es, amd). Trigger: `workflow_dispatch` with `source_ref` input.

Steps: check out branch, install deps, run `npm run build -- $source_ref`, run tests (see unresolved), commit, push.

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

Auto-derive the dependency graph from lodash.js. Eliminates mapping.js maintenance and makes the commitish approach fully reproducible — the source alone determines the build output.

### 3.1 Build the mapping generator

A standalone script that reads lodash.js and produces mapping.js (same format the CLI already consumes). Extracts funcDep, varDep, aliasToReal, and category from the source via static analysis.

```bash
node scripts/generate-mapping.js lodash.js > mapping.js
```

**Approach**: Use acorn (ES5 parser) to walk the AST. For each function, collect Identifier references that match other known function/variable names. Aliases from the `lodash.xxx = yyy` assignments. Categories from JSDoc `@category` tags.

**Effort**: ~200 lines. Validate by diffing output against the existing hand-maintained mapping.js — if they match, the generator is correct.

### 3.2 Wire mapping into the CLI

Patch the CLI to look for mapping.js in the `--source-dir` directory before falling back to its own bundled copy. No new flag needed — the source dir already contains everything.

**Effort**: ~10-line patch (check `sourceDir/mapping.js` || `sourceDir/lib/mapping.js` || fall back to bundled).

### 3.3 Commit generated mapping on main

The generator lives on main. Run it, commit the output as `lib/mapping.js` (or `mapping.js`) on main. CI can verify freshness: run generator, diff against committed mapping, fail if stale.

Build scripts don't change — they already pass the full source tree to the CLI via `git archive`, and the mapping is now part of that tree.

### Phase 3 delivers

- No manual mapping.js maintenance
- Commitish = sole input. Same source → same output regardless of CLI version.
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
  1.2 Patch CLI (--source-dir)     ─── one PR to CLI
  1.3 Build scripts on dist        ─── one commit per branch
                                       commitish → git archive → source dir → CLI
          │
          ├──→ Phase 2 (automation):                  ──→ the 80%
          │      2.1 PR build verification             ─── workflow on main
          │      2.2 Per-branch build workflow          ─── workflow on each dist branch
          │      2.3 Tag dispatcher                    ─── workflow on main
          │
          └──→ Phase 3 (eliminates mapping risk):     ──→ safety net
                 3.1 Build mapping generator           ─── ~200 lines, validate against existing
                 3.2 Patch CLI (read mapping            ─── ~10-line PR
                      from source dir)
                 3.3 Commit mapping on main             ─── travels with source via git archive

Phase 4 (parallel, not blocking — can start anytime after phase 1):
  Modern build tool rewrite        ─── ~500 lines, validated against old CLI
                                       subsumes phase 3 if done first
```

Phase 1 + Phase 2 is the 80% — a functioning, automated release pipeline. Phase 3 is insurance against stale mappings (rare for v4 but dangerous when it happens). Phase 4 runs in parallel whenever there's appetite — if it lands before phase 3, skip phase 3 entirely.

## Non-Goals for v4

- Monorepo / workspaces restructuring
- Changing the monolith source format
- Auto-publishing (initially — add later once confidence is high)
