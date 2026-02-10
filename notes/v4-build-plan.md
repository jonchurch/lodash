# Lodash v4 — Build Automation Plan

> Minimal changes to make the v4 build/release process self-describing, reproducible, and automatable. Phased so each phase delivers value independently.

## Phase 1 — Usable CLI + Build Scripts (unblocks releases)

Get the existing CLI into a usable state with a sane interface. Doesn't solve mapping staleness — the bundled mapping is correct for v4.17.23 and only goes stale when function deps change (rare). Solves: tribal knowledge, orphaned tooling, backwards interface.

### 1.1 Unarchive lodash-cli

Unarchive `lodash/lodash-cli` on GitHub. Merge Ben Tan's 5 commits from `bnjmnt4n/lodash-cli` (mapping updates for 4.17.20/21, template fix).

**Effort**: Admin action + one merge.

### 1.2 Patch CLI to accept `--source <filepath>`

The CLI reads source from an explicit path instead of requiring it in `node_modules/lodash/`. Small patch to `bin/lodash` — change where `source` is read from.

**Effort**: 10-20 lines. One PR to lodash-cli.

**Result**: `lodash modularize exports=node --source /tmp/lodash.js -o ./out/` — a sane invocation. No more `cp` into node_modules.

### 1.3 Add build scripts to distribution branches

Each dist branch gets a `build.sh` that wraps lodash-cli. The script resolves a commitish/tag/filepath to a local file via `git show`, then calls the CLI with `--source`. Default: `main`.

```bash
npm run build                          # builds from main HEAD
npm run build -- v4.17.24              # builds from a tag
npm run build -- ./local.js            # builds from a local file
npm run build -- abc123f               # builds from a SHA
```

Ref resolution lives in the build script (simple `git show $ref:lodash.js`), not in the CLI. The CLI stays git-unaware — it just takes a file path.

**npm branch** (most involved): modularize CJS + copy raw monolith + minify + core + FP modules.
**es branch**: modularize ES only.
**amd branch**: modularize AMD + AMD-wrapped monolith.

`lodash-cli` is a devDependency on each branch.

**Effort**: One commit per dist branch.

**Result**: `npm run build` on any dist branch produces its distribution files. Self-describing. A maintainer can look at the build script and understand exactly how the package is built. The commitish interface means builds from any point in history work.

**Limitation**: The CLI's bundled mapping.js must match the source's dep graph. If you change deps in lodash.js without updating the CLI's mapping, modular builds silently break. Phase 2 eliminates this risk.

### Phase 1 delivers

- A maintained, hackable build tool
- `npm run build -- v4.17.24` on any dist branch
- No tribal knowledge — the build process is in source
- Releases can ship using the existing CLI

---

## Phase 2 — Mapping Generator (eliminates manual mapping)

Auto-derive the dependency graph from lodash.js. Eliminates mapping.js maintenance and makes the commitish approach fully reproducible — the source alone determines the build output.

### 2.1 Build the mapping generator

A standalone script that reads lodash.js and produces mapping.js (same format the CLI already consumes). Extracts funcDep, varDep, aliasToReal, and category from the source via static analysis.

```bash
node scripts/generate-mapping.js lodash.js > mapping.js
```

**Approach**: Use acorn (ES5 parser) to walk the AST. For each function, collect Identifier references that match other known function/variable names. Aliases from the `lodash.xxx = yyy` assignments. Categories from JSDoc `@category` tags.

**Effort**: ~200 lines. Validate by diffing output against the existing hand-maintained mapping.js — if they match, the generator is correct.

### 2.2 Wire mapping into the CLI

Patch the CLI to accept `--mapping <filepath>` (or auto-discover mapping.js adjacent to the source file). Falls back to bundled mapping for backwards compat.

**Effort**: ~10-line patch.

### 2.3 Update build scripts

Build scripts on dist branches generate the mapping on the fly (or pull a pre-generated one from the ref). The commitish now controls both source AND mapping — true reproducibility.

```bash
# In build.sh, after resolving source:
git show "$SOURCE_REF:lodash.js" > "$TMP/lodash.js"
node generate-mapping.js "$TMP/lodash.js" > "$TMP/mapping.js"
npx lodash-cli modularize --source "$TMP/lodash.js" --mapping "$TMP/mapping.js" -o ./
```

Or simpler: the generator lives on main, committed mapping.js lives on main, build script pulls both from the ref.

### Phase 2 delivers

- No manual mapping.js maintenance
- Commitish = sole input. Same source → same output regardless of CLI version.
- CI can verify mapping freshness (run generator, diff against committed mapping)
- Safe to make non-trivial changes to lodash v4 without fear of stale mappings

---

## Phase 3 — CI Workflows (automation)

### 3.1 Build verification on PR to main

Lives on main. Trigger: `pull_request`.

Steps: check out PR, install CLI, run all build modes, validate output (file counts, key files, syntax). Report pass/fail. Does NOT commit anything.

Purpose: catch build-breaking changes before merge. With phase 2, also verifies mapping is up to date.

### 3.2 Per-branch build workflow

Lives on each dist branch. Trigger: `workflow_dispatch` with `source_ref` input.

Steps: check out branch, install deps, run `npm run build -- $source_ref`, run tests (see unresolved), commit, push.

Each branch builds itself, tests itself, commits to itself. Failures isolated.

Two use cases:
- **Tag push** (via dispatcher, 3.3) → release build. Version from tag, version bumps in package.json/README.
- **Manual dispatch** → refresh/verify. No version ceremony.

### 3.3 Tag-triggered dispatcher

Lives on main. Trigger: tag push matching `v4.*`.

Dispatches each branch's build workflow with the tag as source_ref. This is the only workflow on main that touches dist branches, and all it does is trigger.

Tags should be immutable. `workflow_dispatch` covers testing needs without consuming version numbers. Prerelease tags (`v4.17.24-rc.1`) available if needed to test the full tag pipeline.

### Phase 3 delivers

- Push a tag, walk away — dist branches update themselves
- PRs to main get build verification
- Manual rebuild/refresh anytime via dispatch

---

## Phase 4 — Modern Build Tool (parallel workstream)

Replace the regex-based CLI with an AST-based tool. Can start anytime after phase 1, doesn't block anything.

### Why

3400 lines of regex extraction is opaque, fragile if formatting changes, and maintained by nobody who wrote it. A modern rewrite in ~500 lines with acorn would be more robust, more maintainable, and owned by the current team.

### What

- Parse lodash.js with acorn (ES5 parser, tiny, zero deps)
- Walk AST to extract functions (~50 lines vs 20 regex patterns)
- Derive deps from AST (subsumes the mapping generator from phase 2)
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

Each dist branch's workflow (3.2) should test before committing. What those tests look like is open.

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
  1.1 Unarchive CLI              ─── admin, no code
  1.2 Patch CLI (--source)       ─── one PR to CLI
  1.3 Build scripts on dist      ─── one commit per branch

Phase 2 (eliminates mapping risk):
  2.1 Build mapping generator    ─── ~200 lines, validate against existing
  2.2 Patch CLI (--mapping)      ─── ~10-line PR
  2.3 Update build scripts       ─── small update per branch

Phase 3 (automation):
  3.1 PR build verification      ─── workflow on main
  3.2 Per-branch build workflow   ─── workflow on each dist branch
  3.3 Tag dispatcher             ─── workflow on main

Phase 4 (parallel, not blocking):
  Modern build tool rewrite      ─── ~500 lines, validated against old CLI
```

Phase 1 is the minimum to ship a release with sane tooling. Each subsequent phase adds a layer of safety/automation. Phase 4 runs in parallel whenever there's appetite for it.

## Non-Goals for v4

- Monorepo / workspaces restructuring
- Changing the monolith source format
- Auto-publishing (initially — add later once confidence is high)
