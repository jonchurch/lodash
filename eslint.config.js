// ESLint flat config (v9+)
const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier/recommended');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  // Apply to all JS files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // CommonJS
        global: 'readonly',
        // Test globals (QUnit)
        QUnit: 'readonly',
      },
    },
  },

  // Recommended ESLint rules
  js.configs.recommended,

  // Prettier integration (disables conflicting rules)
  prettier,

  // Import plugin
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // node:test, node:assert
            'external', // lodash, qunitjs
            'internal', // ../../lodash.js (configured below)
            'parent', // ../utils/...
            'sibling', // ./foo
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      'import/internal-regex': '^../../lodash\\.js$',
    },
  },

  // Lodash-specific rules
  {
    rules: {
      // Allow console for now (can disable later)
      'no-console': 'off',

      // Lodash uses function declarations heavily
      'no-inner-declarations': 'off',

      // Allow while(true) patterns in lodash
      'no-constant-condition': ['error', { checkLoops: false }],

      // Lodash has intentional fallthrough in switches
      'no-fallthrough': 'off',

      // Allow == for null checks (lodash pattern)
      'eqeqeq': ['error', 'smart'],
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'vendor/**',
      '*.min.js',
      'core.js',
      'core.min.js',
      'lodash.min.js',
    ],
  },
];
