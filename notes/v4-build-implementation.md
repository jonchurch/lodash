# Lodash v4 — Build Implementation

What was shipped for build automation, why, and where to find it.

## lodash-cli `--source` flag

**PR**: https://github.com/jonchurch/lodash-cli/pull/1

New flag: `--source <path>` replaces `require.resolve('lodash')` at line 2105 of `bin/lodash`. Lets you point the CLI at any `lodash.js` file without installing it into `node_modules/`.

Uses next-arg pattern (like `-o /path`) for consistency with existing CLI conventions. Falls back to `require.resolve('lodash')` when omitted.

The CLI only needs the single `lodash.js` file — it executes it in a VM to read `_.VERSION`. No `package.json` or directory structure required.

## Build scripts on dist branches

Each dist branch is now self-describing: `npm run build -- <ref>` builds the entire package from any git ref (tag, branch, SHA).

| Branch | Package | PR | CLI calls |
|--------|---------|-----|-----------|
| es | lodash-es | [#5](https://github.com/jonchurch/lodash/pull/5) | 1: `modularize exports=es` |
| amd | lodash-amd | [#4](https://github.com/jonchurch/lodash/pull/4) | 2: `modularize exports=amd` + `exports=amd -d main.js` |
| npm | lodash | [#3](https://github.com/jonchurch/lodash/pull/3) | 3: `modularize exports=node` + monolith + core + FP |

Each branch has:
- `scripts/build.sh` — fetches `lodash.js` via raw GitHub URL, passes `--source` to CLI
- `package.json` — `"build": "./scripts/build.sh"`, devDep on `jonchurch/lodash-cli`
- `.npmignore` — excludes `scripts/` from published package

### FP modules (npm branch only)

`scripts/build-fp.js` — standalone reimplementation of `lib/fp/build-modules.js` from main. The original depends on lodash, async, glob, and fs-extra via `lib/common/*`, making it non-portable to the npm branch without adding lodash as a devDependency of itself.

Our version is ~145 lines, zero external deps, produces byte-identical output (~408 FP wrapper files). Reads `fp/_mapping.js` which already lives on the npm branch. Four wrapper templates: module (standard), alias (re-export), thru (pass-through with `_falseOptions`), and category.

This is the one piece of build tooling that lives on a dist branch rather than in lodash-cli. FP files rarely change in v4 — only if functions are added or arities change.

## GHA workflow

**PR**: https://github.com/jonchurch/lodash/pull/6

Single workflow on main: `.github/workflows/build-dists.yml`. Two triggers:
- **Tag push** (`4.*`): builds all three dists, bumps version in `package.json` + `README.md`, opens PRs via `peter-evans/create-pull-request` with signed commits.
- **Manual dispatch** (`workflow_dispatch`): builds from any ref, opens PRs without version bump.

Matrix over `[npm, es, amd]` with `fail-fast: false`. Each job checks out its dist branch, runs `npm install` + `npm run build -- <ref>`, then opens a PR for review.

The workflow resolves the ref to a short SHA (via `git ls-remote`) and includes it in the PR body for traceability.

### What the workflow does NOT do
- npm publish (manual after merging the PR)
- Create dist branch tags like `4.17.24-npm` (manual after merge)
- Run tests against built output (future work)

### Tag conventions
- Source tags: `4.17.24` (no `v` prefix)
- Dist tags: `4.17.24-npm`, `4.17.24-es`, `4.17.24-amd`

### v5 coexistence
GHA runs tag-triggered workflows from the default branch. The v4 dispatcher must stay on the default branch to fire. If main becomes v5, the `4.*` tag filter still works — but each dist branch's `build.sh` default ref (`REF="${1:-main}"`) would need updating to `4.x`.

## Key design decisions

**CLI gets `--source`, not `--ref`**: Shell scripts handle ref resolution (fetch once, pass to multiple CLI calls). Keeps the CLI dumb — file in, files out.

**Raw GitHub URL, not tarball**: `https://raw.githubusercontent.com/lodash/lodash/{ref}/lodash.js` — simpler than fetching and extracting a tarball, works for tags, branches, and SHAs.

**PR-based release flow**: Tag push opens PRs rather than pushing directly to dist branches. Gives maintainers a review step before the built output lands. Manual `npm publish` after merge.

**Signed commits**: Using `peter-evans/create-pull-request` with `sign-commits: true` — commits show as verified from `github-actions[bot]` without needing GPG keys.

## TODO before merging upstream

- [ ] Unarchive `lodash/lodash-cli` and merge `--source` PR there
- [ ] Change `build.sh` on each dist branch from `jonchurch/lodash` to `lodash/lodash` for raw URL
- [ ] Change `lodash-cli` devDep from `jonchurch/lodash-cli` to `lodash/lodash-cli` (or published npm version)
- [ ] Decide on dist branch tags — manual or automated
- [ ] Consider test suite for built output
