# Lodash v4 — Maintenance Model & Reasoning

> Why things are the way they are, what's broken, and what "good" looks like.

## The Setup

Lodash v4 has an unusual source control and distribution model:

- **One monolithic source file** (`lodash.js`, ~17k lines) on `main`
- **Three distribution branches** (`npm`, `es`, `amd`) containing modular per-function files, generated from the monolith by a build tool
- **The build tool** (`lodash-cli`) is a separate, currently archived repo that uses regex extraction (no AST) to decompose the monolith into individual files with resolved dependency graphs
- **Publishing** happens from the distribution branches, not from main

This model has worked for a decade. The monolith is well-tested, the build tool is battle-tested, and the distribution branches serve real packages (`lodash` on npm comes from the `npm` branch, `lodash-es` from `es`).

## What's Actually Broken

### 1. The build process is tribal knowledge

There is no `npm run build` on any branch. The build process lives in a maintainer's head, supplemented by scattered markdown docs and an archived repo's README. A new maintainer cannot figure out how to build a release without archaeology.

### 2. The build tool is orphaned

`lodash-cli` is archived on GitHub. No one can merge PRs, cut releases, or make fixes. Ben Tan's fork has the most recent working patches (mapping updates for 4.17.20/21) but it's a personal fork, not an official anything.

### 3. The dependency graph lives in the wrong place

`mapping.js` in lodash-cli encodes which lodash functions depend on which other functions (`funcDep`, ~400 entries). This is intrinsically a property of `lodash.js` — when you change a function's dependencies in the monolith, you must update `mapping.js` in a separate repo or the modular build silently ships broken code. There is no check, no CI, no guard. It's "hope the maintainer remembers."

### 4. The build tool's interface is backwards

lodash-cli expects the lodash source to be installed in its own `node_modules/lodash/`. Normal build tools point at source; this one wants source installed as a dependency of itself. Every invocation requires a manual `cp lodash.js` into the right place.

### 5. No verification of built output

Tests run against `lodash.js` on main. Nothing tests the modular files that actually get published. The build tool does non-trivial transformations (regex extraction, dependency resolution, runInContext removal, export format conversion). If any of that produces broken output, we find out from users, not CI.

### 6. No CI for the build/release pipeline

There's no GitHub Action or any automation for building or releasing. Travis CI configs exist in history but are defunct. Every release is fully manual.

## What's Weird But Fine

- **The monolith**: It IS lodash v4. Changing it is out of scope for v4 maintenance.
- **Regex-based extraction**: Quirky, but relies on lodash's strict formatting conventions which haven't changed. The patterns are stable and well-tested. Fine for now, but a latent risk — if formatting changes, extraction silently breaks. A modern AST-based rewrite (~500 lines with acorn, replacing ~3400 lines of regex) is on the roadmap as a parallel workstream, validated by diffing output against the existing CLI.
- **Build output committed to branches**: Unusual but functional. It gives published packages full git history, makes them browsable on GitHub, and supports `npm install lodash/lodash#npm` for git-based installs. Many projects do worse.
- **Separate distribution branches**: A consequence of shipping three package formats from one source. Workspaces or a monorepo would be more modern but would be a massive structural change for no v4 benefit.

## What "Good" Looks Like (2026)

A well-maintained project on GitHub in 2026 has these properties:

**Self-describing**: A maintainer can clone the repo, read the README and package.json, and understand how to build, test, and release. No tribal knowledge required. Build commands are in `scripts`, not in someone's head.

**Reproducible**: Given the same source, the build produces the same output. Build inputs are explicit (source file, tool version), not implicit (whatever's in node_modules). Builds are deterministic and auditable.

**Verified**: CI catches breakage before it ships. For lodash this means: tests pass on main (already true), the build succeeds (not currently checked), and ideally the built output is functionally correct (not currently tested).

**Low-ceremony releases**: A maintainer makes changes, gets them reviewed and merged, then triggers a release with a single action (push a tag, click a button). Mechanical steps (build, commit to dist branches, publish) are automated. Human judgment steps (review, deciding to release) are not.

**Transparent**: Anyone can see what's released, what's pending, and what changed. Git history, changelogs, and GitHub releases serve this. Build provenance (which source commit produced which dist commit) is traceable.

## The Dist Branch Source Control Question

The dist branches (npm, es, amd) contain generated code. How and when should they be updated?

**Considered and rejected:**

- **Sync on every commit to main**: Wrong rhythm. Lodash v4 gets ~5 commits/year. Generates 3 dist commits per main commit that nobody publishes. Creates a state where dist branches have unpublished, untagged code — someone installing via git ref gets unreleased changes.
- **Cron/nightly**: Arbitrary timing disconnected from any human decision. Worse version of the above. Absurd at lodash's cadence.
- **One monolithic workflow on main builds everything**: Conflates the build decision with branch management. The build tool runs on main but has to reach into three other branches to commit. Conceptually wrong — each package should own its own build.
- **PR-based updates to dist branches**: 3 PRs per release, reviewing generated code. The review step sounds nice but generated code isn't meaningfully reviewable — the real review happens on the PR to main. Noise.

**Chosen approach:**

- **Tag-triggered release**: Push `v4.17.24` tag → dispatcher triggers each branch's build workflow → each branch builds, tests, commits to itself. Human decides when to release (by pushing a tag), machines do the mechanical work.
- **Manual dispatch for refresh**: `workflow_dispatch` on each branch for ad-hoc rebuilds, verification, or keeping branches fresh. No version implications, no tag needed.

Each dist branch owns its own build workflow. The build script lives on the branch, accepts a commitish (tag, SHA, branch name) or directory path, and knows how to produce that branch's distribution files. The commitish is resolved to a full source tree via `git archive` — this extracts the entire file tree at any ref from within the same repo, no cloning or network needed. The CLI gets a directory (`--source-dir`) and reads whatever it needs from it (lodash.js, package.json, mapping.js, FP build scripts). The build script never needs to know which specific files the CLI requires. The branch is self-describing — a maintainer can look at it and understand how it's built without knowing anything about main's workflows.

Tags are immutable. If you need to test the full tag-triggered pipeline, use a prerelease tag (`v4.17.24-rc.1`) or just use `workflow_dispatch` (which covers most testing needs without consuming a version number).

**Why per-branch, not centralized**: The build always flows from main outward, but each dist branch is a distinct package with its own format, its own extras (FP modules on npm, main.js on amd), and potentially its own tests. Centralizing all of that in one workflow on main means one workflow knows the details of three different packages. Per-branch workflows keep each package self-contained and independently evolvable. Failures are isolated — a broken AMD build doesn't block npm.

## Principles Guiding Changes

1. **Budget change points**: Prefer the smallest change that solves the problem. Don't rewrite what works.
2. **Make it quack like a normal project**: `npm run build` should work. `npm test` should work. These aren't ambitious goals, they're table stakes.
3. **Separate concerns**: Building, testing, committing, and publishing are different operations with different triggers. Don't conflate them in one script.
4. **Keep humans where they matter**: Humans decide what to change and when to release. Machines do the building and mechanical steps.
5. **Version-couple what's coupled**: If two things must change together (lodash.js and its dependency graph), they should live together.
