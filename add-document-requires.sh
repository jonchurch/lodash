#!/bin/bash

FILES="test/extracted/clone_methods.js test/extracted/lodash_methods.js test/extracted/lodash.isElement.js test/extracted/lodash.isEqual.js test/extracted/lodash.isFunction.js test/extracted/lodash.isObject.js test/extracted/lodash.isPlainObject.js test/extracted/lodash.map.js test/extracted/lodash.merge.js test/extracted/lodash.noConflict.js test/extracted/lodash.slice_and_lodash.toArray.js"

for file in $FILES; do
  FIRST_REQUIRE_LINE=$(grep -n "^var .* = require" "$file" | head -1 | cut -d: -f1)
  
  sed -i "" "${FIRST_REQUIRE_LINE}i\\
var document = require('../utils/environment.js').document;\\

" "$file"
  echo "Added document require to: $file"
done
