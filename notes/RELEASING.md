# Releasing Lodash v4

> This is a work-in-progress runbook based on the current automation. Some steps may change as we upstream to `lodash/lodash`.

## Prerequisites

- Push access to the lodash repo (main + dist branches)
- npm publish access for `lodash`, `lodash-es`, `lodash-amd`
- The `--source` flag merged into whichever lodash-cli the dist branches depend on

## Steps

### 1. Apply your changes on main

Make your fix/change to `lodash.js` on main. Commit and push.

### 2. Bump the version on main

Update `var VERSION = '...'` in `lodash.js` and `"version"` in `package.json`. Commit:

```bash
git commit -am "Bump to 4.17.24"
```

### 3. Push a tag

Tags have no `v` prefix:

```bash
git tag 4.17.24
git push origin 4.17.24
```

This triggers the `build-dists.yml` workflow on main.

### 4. Wait for PRs

The workflow builds all three distributions in parallel and opens PRs:
- PR to `npm` branch — CJS modules + monolith + core + FP
- PR to `es` branch — ES modules
- PR to `amd` branch — AMD modules

Each PR has a signed commit from `github-actions[bot]` with the message `Rebuilt from 4.17.24`. The PR body includes the ref and short SHA for traceability.

### 5. Review and merge

Review the PRs. Key things to look for:
- Version is correct in `package.json` and README first line
- File counts look sane (npm: ~628 + ~408 fp, es: ~640, amd: ~638)
- No unexpected file deletions or additions

Merge each PR.

### 6. Tag the dist branches

After merging, tag each dist branch:

```bash
git tag 4.17.24-npm npm
git tag 4.17.24-es es
git tag 4.17.24-amd amd
git push origin 4.17.24-npm 4.17.24-es 4.17.24-amd
```

### 7. Publish to npm

Publish `es` and `amd` first, then `npm` (the main `lodash` package):

```bash
git checkout es && npm publish
git checkout amd && npm publish
git checkout npm && npm publish
```

## Ad-hoc rebuilds (no release)

To rebuild dist branches from any ref without bumping versions:

```bash
# Via GitHub Actions UI:
# Go to Actions → Build Distributions → Run workflow
# Enter the ref (branch, tag, or SHA)
```

Or via CLI:

```bash
gh workflow run build-dists.yml -f ref=main
```

This opens PRs without version bumps. Useful for syncing dist branches after non-version-changing fixes.

## TODO

- [ ] Automate dist branch tagging (step 6)
- [ ] Automate npm publish — separate workflow triggered by merge or manual dispatch
- [ ] GitHub releases — figure out the right model (one release on the source tag? per-dist? how to generate notes between tags?)
- [ ] Add smoke tests to the build workflow before opening PRs
- [ ] Add build summary (file counts, bundle sizes) to PR body
