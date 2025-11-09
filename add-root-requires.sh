#!/bin/bash

FILES="test/extracted/clone_methods.js test/extracted/isType_checks.js test/extracted/lodash_methods.js test/extracted/lodash.delay.js test/extracted/lodash.isEqual.js test/extracted/lodash.isFunction.js test/extracted/lodash.isNative.js test/extracted/lodash.isTypedArray.js test/extracted/lodash.merge.js test/extracted/lodash.noConflict.js test/extracted/lodash.transform.js test/extracted/zipObject_methods.js"

for file in $FILES; do
  FIRST_REQUIRE_LINE=$(grep -n "^var .* = require" "$file" | head -1 | cut -d: -f1)
  
  sed -i "" "${FIRST_REQUIRE_LINE}i\\
var root = require('../utils/environment.js').root;\\

" "$file"
  echo "Added root require to: $file"
done
