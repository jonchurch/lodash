#!/usr/bin/env node

/**
 * Script to extract QUnit.module blocks from test/test.js into individual files.
 * Each extracted file will include metadata about its original location.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, 'test/test.js');
const OUTPUT_DIR = path.join(__dirname, 'test/extracted');
const MODULE_DELIMITER = /^\s*\/\*-{10,}\*\/\s*$/; // Matches /*----------*/ and similar

// Read the entire test file
console.log(`Reading ${INPUT_FILE}...`);
const lines = fs.readFileSync(INPUT_FILE, 'utf8').split('\n');
console.log(`Total lines: ${lines.length}`);

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// State machine for parsing
let currentModule = null;
let modules = [];
let lineNum = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  lineNum = i + 1; // Line numbers are 1-indexed

  // Check if this is a QUnit.module declaration
  const moduleMatch = line.match(/^\s*QUnit\.module\('([^']+)'\);?\s*$/);

  if (moduleMatch) {
    // If we were already in a module, save it
    if (currentModule) {
      currentModule.endLine = i; // Previous line was the end
      modules.push(currentModule);
    }

    // Start a new module
    currentModule = {
      name: moduleMatch[1],
      startLine: lineNum,
      endLine: null,
      lines: [line]
    };

    console.log(`Found module at line ${lineNum}: ${moduleMatch[1]}`);
  } else if (currentModule) {
    // We're inside a module, collect lines
    currentModule.lines.push(line);
  }
}

// Don't forget the last module
if (currentModule) {
  currentModule.endLine = lines.length;
  modules.push(currentModule);
}

console.log(`\nExtracted ${modules.length} modules`);

// Write each module to its own file
let fileCount = 0;
modules.forEach((module, index) => {
  // Determine filename
  // For 'lodash.chunk' -> 'lodash.chunk.js'
  // For other modules, keep as-is
  const safeName = module.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${safeName}.js`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  // Build frontmatter comment
  const frontmatter = [
    '/**',
    ` * Extracted from: test/test.js`,
    ` * Module: ${module.name}`,
    ` * Original lines: ${module.startLine}-${module.endLine}`,
    ' */',
    ''
  ].join('\n');

  // Combine frontmatter with module content
  const content = frontmatter + module.lines.join('\n');

  // Write to file
  fs.writeFileSync(filePath, content, 'utf8');
  fileCount++;

  if ((index + 1) % 50 === 0) {
    console.log(`Wrote ${index + 1} files...`);
  }
});

console.log(`\n✓ Successfully extracted ${fileCount} modules to ${OUTPUT_DIR}/`);
console.log(`\nSummary:`);
console.log(`  Input: ${INPUT_FILE} (${lines.length} lines)`);
console.log(`  Output: ${OUTPUT_DIR}/ (${fileCount} files)`);
