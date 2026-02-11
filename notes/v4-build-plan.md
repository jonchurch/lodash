# Lodash v4 — Build Automation Plan

> Minimal changes to make the v4 build/release process self-describing, reproducible, and automatable. Phased so each phase delivers value independently.

## Phase 1 — Usable CLI + Build Scripts (unblocks releases)

Get the existing CLI into a usable state with a sane interface. Doesn't solve mapping staleness — the bundled mapping is correct for v4.17.23 and only goes stale when function deps change (rare). Solves: tribal knowledge, orphaned tooling, backwards interface.

### 1.1 Unarchive lodash-cli

Unarchive `lodash/lodash-cli` on GitHub. Merge Ben Tan's 5 commits from `bnjmnt4n/lodash-cli` (mapping updates for 4.17.20/21, template fix).

**Effort**: Admin action + one merge.

### 1.2 Patch CLI with `--ref` and `--source-dir`

Two new mutually exclusive flags, replacing the `node_modules/lodash/` convention:

**`--ref <tag|branch|SHA>`** — fetches the source tree from GitHub as a tarball for the given ref. Defaults to `lodash/lodash` repo, overridable with `--repo owner/name`. No local git repo needed — works from anywhere (CI runners, standalone installs, any machine with network).

```bash
lodash modularize exports=node --ref v4.17.24 -o ./out/
lodash modularize exports=node --ref abc123f --repo jonchurch/lodash -o ./out/
```

**`--source-dir <path>`** — reads from a local directory containing `lodash.js`, `package.json`, and anything else the CLI needs. For local dev, testing, or offline use.

```bash
lodash modularize exports=node --source-dir ./path/to/checkout -o ./out/
```

If neither flag is provided, falls back to `node_modules/lodash/` for backwards compat.

The version string comes from `var VERSION` in lodash.js (or `package.json` in the source), no separate `--version` flag needed.

**Effort**: ~30-50 lines. One PR to lodash-cli. The `--ref` path is: fetch `https://github.com/{repo}/archive/{ref}.tar.gz`, extract to temp dir, read from it.

### 1.3 Add build scripts to distribution branches

Each dist branch gets build scripts in `package.json`. Since the CLI handles ref resolution via `--ref` (fetching from GitHub), the build scripts are pure orchestration — no git-awareness, no temp dirs.

**npm branch** — three CLI invocations + FP generation:

```json
{
  "scripts": {
    "build": "bash build.sh && npm run build-fp",
    "build-fp": "node build-fp.js"
  }
}
```

```bash
# build.sh — three lodash-cli calls, order matters:
REF="${1:-main}"

# 1. Modular CJS files (~628 files)
npx lodash-cli modularize exports=node --ref "$REF" -o ./

# 2. Monolith + minified (overwrites the barrel from step 1)
#    Verified: lodash -d output is byte-identical to source lodash.js
npx lodash-cli --ref "$REF" -o ./lodash.js

# 3. Core builds (core.js + core.min.js)
npx lodash-cli core --ref "$REF" -o ./core.js
```

FP modules (~415 wrappers) are separate from lodash-cli. `build-fp.js` and its FP mapping live on the npm branch — they're a property of the npm package, not the source. Can be run independently.

**es branch** — one call:
```json
{ "scripts": { "build": "npx lodash-cli modularize exports=es --ref ${REF:-main} -o ./" } }
```

**amd branch** — two calls:
```json
{ "scripts": { "build": "npx lodash-cli modularize exports=amd --ref ${REF:-main} -o ./ && npx lodash-cli exports=amd -d --ref ${REF:-main} -o ./main.js" } }
```

Usage (any branch):
```bash
npm run build                       # builds from main HEAD (via GitHub)
REF=v4.17.24 npm run build         # builds from a tag
REF=abc123f npm run build           # builds from a SHA
```

`lodash-cli` is a devDependency on each branch.

**Effort**: One commit per dist branch. Es and amd are one-liners. Npm needs build.sh (~10 lines) + build-fp.js (committed on the branch).

**Limitation**: The CLI's bundled mapping.js must match the source's dep graph. If you change deps in lodash.js without updating the CLI's mapping, modular builds silently break. Phase 3 eliminates this risk.

### Phase 1 delivers

- A maintained, hackable build tool
- `REF=v4.17.24 npm run build` on any dist branch — ref as the primary interface
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

Auto-derive the dependency graph from lodash.js. Eliminates mapping.js maintenance and makes the ref-based approach fully reproducible — the source alone determines the build output.

### 3.1 Build the mapping generator

A standalone script that reads lodash.js and produces mapping.js (same format the CLI already consumes). Extracts funcDep, varDep, aliasToReal, and category from the source via static analysis.

```bash
node scripts/generate-mapping.js lodash.js > mapping.js
```

**Approach**: Use acorn (ES5 parser) to walk the AST. For each function, collect Identifier references that match other known function/variable names. Aliases from the `lodash.xxx = yyy` assignments. Categories from JSDoc `@category` tags.

**Effort**: ~200 lines. Validate by diffing output against the existing hand-maintained mapping.js — if they match, the generator is correct.

### 3.2 Wire mapping into the CLI

Patch the CLI to look for mapping.js in the source directory (whether fetched via `--ref` or provided via `--source-dir`) before falling back to its own bundled copy. No new flag needed — the CLI already has the full source tree after ref resolution.

**Effort**: ~10-line patch.

### 3.3 Commit generated mapping on main

The generator lives on main. Run it, commit the output as `lib/mapping.js` (or `mapping.js`) on main. CI can verify freshness: run generator, diff against committed mapping, fail if stale.

Build scripts don't change — the CLI fetches the full source tree via `--ref`, and the mapping is now part of that tree.

### Phase 3 delivers

- No manual mapping.js maintenance
- Ref = sole input. Same source → same output regardless of CLI version.
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
  1.2 Patch CLI (--ref, --source-dir) ─── one PR to CLI
  1.3 Build scripts on dist        ─── one commit per branch (es/amd: one-liners, npm: build.sh + build-fp.js)
          │
          ├──→ Phase 2 (automation):                  ──→ the 80%
          │      2.1 PR build verification             ─── workflow on main
          │      2.2 Per-branch build workflow          ─── workflow on each dist branch
          │      2.3 Tag dispatcher                    ─── workflow on main
          │
          └──→ Phase 3 (eliminates mapping risk):     ──→ safety net
                 3.1 Build mapping generator           ─── ~200 lines, validate against existing
                 3.2 Patch CLI (read mapping            ─── ~10-line PR
                      from source tree)
                 3.3 Commit mapping on main             ─── travels with source via --ref

Phase 4 (parallel, not blocking — can start anytime after phase 1):
  Modern build tool rewrite        ─── ~500 lines, validated against old CLI
                                       subsumes phase 3 if done first
```

Phase 1 + Phase 2 is the 80% — a functioning, automated release pipeline. Phase 3 is insurance against stale mappings (rare for v4 but dangerous when it happens). Phase 4 runs in parallel whenever there's appetite — if it lands before phase 3, skip phase 3 entirely.

## Non-Goals for v4

- Monorepo / workspaces restructuring
- Changing the monolith source format
- Auto-publishing (initially — add later once confidence is high)
