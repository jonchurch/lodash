# Lodash-CLI — Maintainer Reference

> How lodash-cli works, how to use it, and what to watch for when maintaining it.
> Goal: use lodash-cli to automate v4 distribution builds from the monolithic `lodash.js` on main.

## Status

- **Upstream**: https://github.com/lodash/lodash-cli (archived)
- **Working fork**: https://github.com/bnjmnt4n/lodash-cli (Ben Tan's fork, not archived)
- **Fork divergence**: 5 commits ahead of upstream — mapping updates + version bumps for 4.17.20/4.17.21, plus a `_.template` fix preservation
- **Plan**: Unarchive `lodash/lodash-cli`, merge Ben's commits, own it going forward
- **Tested**: Works against current `lodash.js` v4.17.23 with zero code changes needed

## What It Does

Takes `lodash.js` (monolith on main) as input, produces all distribution formats:

```bash
# Minified monolith (for dist/)
lodash -o ./dist/lodash.js

# Development monolith (unminified)
lodash -d -o ./lodash.js

# Modular CJS files (for npm branch — the published lodash package)
lodash modularize exports=node -o ./

# ES modules (for es branch)
lodash modularize exports=es -o ./

# Core build (~4kb subset)
lodash core -o ./dist/lodash.core.js
```

The CI pipeline (`.travis.yml` on main) used to run these automatically.

## How It Works

### Flow: Monolith → Regex Extract → Dependency Resolve → Transform → Output

No AST. Everything is regex-based, relying on lodash's strict formatting conventions.

### File Map

| File | Role | Maintenance frequency |
|------|------|----------------------|
| `lib/mapping.js` | Static dependency graph (`funcDep`, `varDep`, aliases, categories) | **Update when lodash.js function deps change** |
| `lib/listing.js` | Derived metadata (core funcs, build exports, uninlinables) | Rarely |
| `lib/const.js` | Regex patterns, help text | Rarely |
| `bin/lodash` | Build engine (3401 lines) | Rarely — only if lodash formatting conventions change |
| `lib/minify.js` | Closure Compiler + UglifyJS minification | Rarely |
| `lib/preprocess.js` | Pre-minification transforms | Rarely |
| `lib/postprocess.js` | Post-minification cleanup | Rarely |
| `lib/util.js` | FS/path helpers, `Hash` constructor | Never |
| `template/` | Templates for npm package README/LICENSE/package.json | Rarely |

### mapping.js — The Maintenance Surface

This is what you'll touch most. Three key maps:

**`funcDep`** — function-to-function dependencies (~400 entries):
```js
'map': ['arrayMap', 'baseMap', 'getIteratee', 'isArray'],
'baseUnset': ['castPath', 'last', 'parent', 'toKey'],
'debounce': ['clearTimeout', 'isObject', 'now', 'setTimeout', 'toNumber'],
```

**`varDep`** — function-to-variable dependencies (~50 entries):
```js
'DataView': ['root'],
'clearTimeout': ['root'],
'isMasked': ['coreJsData'],
'template': ['reInterpolate', 'templateSettings'],
```

**`aliasToReal`** — alias mappings:
```js
'each': 'forEach',
'extend': 'assignIn',
'first': 'head',
```

If you add a dependency to a function in `lodash.js`, you must update `funcDep`. If you don't, the modular build will be missing that dependency and break at runtime.

### Function Extraction (matchFunction)

`matchFunction(source, funcName)` uses ~20 regex patterns to find function declarations, expressions, and variable assignments by name. It's memoized. The patterns handle:
- Function declarations: `function foo() {}`
- Expression at start of var list: `var foo = function() {},`
- Expression mid-list: `, foo = function() {}`
- Standalone expression: `var foo = function() {};`
- Built-in constructor refs: `var Map = root.Map,`
- getNative calls: `var nativeCreate = getNative(Object, 'create'),`
- Creator functions: `var ceil = createRound('ceil');`

### Dependency Resolution

`getAllDependencies(identifier, funcDepMap, varDepMap)` — recursive, returns all transitive deps. Used to determine what to include in each build.

### Build Modes

**Monolithic** (default): Prunes unused functions from monolith via regex removal, customizes export format (UMD/AMD/CJS/global), minifies.

**Modularize** (`modularize` command): Extracts each function into its own file. Key behaviors:
- `runInContext` and `noConflict` are forcibly excluded (line 2998 of `bin/lodash`)
- For npm packages: private functions (`_`-prefixed) are inlined into dependents
- For ES/CJS modules: private functions get their own files
- `removeRunInContext()` strips the factory wrapper, replaces `context` refs with `root`
- Seq/chain methods get special handling

**Core** (`core` command): Replaces many functions with simplified implementations (e.g., `keys = nativeKeys`, `clone` without deep/typed support). ~4kb.

### Minification Pipeline

Tries three strategies, picks smallest gzipped output:
1. Closure Compiler (simple optimizations)
2. Closure Compiler (advanced optimizations)
3. UglifyJS

Then also tries hybrids (Closure → UglifyJS). Requires Java for Closure Compiler.

**Note**: Uses `uglify-js@2.7.5` and `closure-compiler@0.2.12` — both very old. UglifyJS 2.x doesn't support ES6+. This hasn't mattered because lodash.js is ES5, but worth knowing.

## Using It

### Setup

```bash
git clone https://github.com/bnjmnt4n/lodash-cli ./lodash-cli
cd lodash-cli && npm install --production

# Point it at current lodash.js
mkdir -p node_modules/lodash
cp /path/to/lodash/lodash.js node_modules/lodash/lodash.js
cp /path/to/lodash/package.json node_modules/lodash/package.json
```

### Release Workflow (What We Want to Automate)

1. Make changes to `lodash.js` on main
2. Run lodash-cli to generate all outputs:
   ```bash
   node bin/lodash -d -o ./out/lodash.js          # dev monolith
   node bin/lodash -o ./out/dist/lodash.js         # minified monolith
   node bin/lodash core -o ./out/dist/lodash.core.js  # core build
   node bin/lodash modularize exports=node -o ./out/npm/   # CJS modules
   node bin/lodash modularize exports=es -o ./out/es/      # ES modules
   ```
3. Commit outputs to distribution branches (npm, es, amd)
4. Publish from those branches

This replaces the manual "apply diff to each branch" process.

## Maintenance Scenarios

### "I changed a function's dependencies in lodash.js"

Update `funcDep` in `lib/mapping.js`. Example: if `baseUnset` now depends on `hasOwnProperty`, add it:
```js
'baseUnset': ['castPath', 'hasOwnProperty', 'last', 'parent', 'toKey'],
```

### "I added a new function to lodash.js"

1. Add to `funcDep` with its dependencies
2. Add to the appropriate `category` list
3. If it has variable deps, add to `varDep`
4. If it's an alias, add to `aliasToReal`

### "I changed formatting in lodash.js"

This is the risky one. The regex extraction in `matchFunction` depends on lodash's formatting conventions (2-space indent, specific function declaration styles). If you change how functions are written, extraction may silently fail. Always verify build output after formatting changes.

### "lodash-cli's own dependencies are outdated"

- `lodash@4.17.20` — lodash-cli uses lodash itself for its build logic. The version in its own package.json is pinned.
- `uglify-js@2.7.5` — ES5 only. Fine for lodash v4.
- `closure-compiler@0.2.12` — Requires Java. Optional (falls back to UglifyJS-only if Java not present).

## Verified Build Output (v4.17.23)

Tested Feb 2026. Results:
- All build modes succeed (monolith, modular CJS, ES modules, core)
- 628 CJS modules generated, 640 ES modules
- Modular files match npm branch content (only diffs are jsdoc changes from 4.17.22/4.17.23 that weren't propagated to npm branch)
- Security fix (baseUnset prototype pollution) correctly present in all outputs
- `runInContext` functional in built monolith
- No mapping updates needed for 4.17.21→4.17.23 (changes were code fixes and jsdoc only, no new dependencies)
