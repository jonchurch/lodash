# Building Lodash Documentation HTML

## Steps

```bash
# 1. Switch to Node 11
nvm use 11

# 2. Install dependencies (if not done yet)
npm install

# 3. Build docs
npm run doc:sitehtml

# Output: doc/4.17.21.html
```

## Why Node 11?
`oniguruma@6.2.1` (used by marky-markdown) is incompatible with modern Node.js due to old `nan@^2.0.9` and V8 API changes. Node 11 is the newest version that works.

## If you have `ignore-scripts=true` in `~/.npmrc`

Check if you have it enabled:
```bash
npm config get ignore-scripts
```

If it returns `true`, use these commands instead:

```bash
# 1. Switch to Node 11
nvm use 11

# 2. Manually build oniguruma (one-time)
cd node_modules/oniguruma && npx node-gyp@8 rebuild && cd ../..

# 3. Build docs directly
node lib/main/build-doc site && node lib/main/build-site

# Output: doc/4.17.21.html
```
