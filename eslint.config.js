import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { neostandard } from 'neostandard'

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  ...neostandard({
    env: ['browser', 'node'],
    globals: {
      BufferEncoding: 'readonly',
    },
    ts: true,
  }),
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
    },
  },
]
