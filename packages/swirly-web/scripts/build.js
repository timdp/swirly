#!/usr/bin/env node

import { fileURLToPath } from 'node:url'

import esbuild from 'esbuild'
import fs from 'fs-extra'

const PKG_ROOT = new URL('../', import.meta.url)
const REPO_ROOT = new URL('../../', PKG_ROOT)

const SRC_DIR = new URL('src/', PKG_ROOT)
const DIST_DIR = new URL('dist/', PKG_ROOT)
const LERNA_JSON = new URL('lerna.json', REPO_ROOT)

const { version: VERSION } = await fs.readJson(fileURLToPath(LERNA_JSON))

const baseConfig = {
  target: 'es2020',
  entryPoints: [fileURLToPath(new URL('app.ts', SRC_DIR))],
  bundle: true,
  define: {
    VERSION: JSON.stringify(VERSION)
  }
}

const configs = [
  {
    ...baseConfig,
    outfile: fileURLToPath(new URL('bundle.js', DIST_DIR)),
    minify: false,
    sourcemap: 'inline'
  },
  {
    ...baseConfig,
    outfile: fileURLToPath(new URL('bundle.min.js', DIST_DIR)),
    minify: true,
    sourcemap: false
  }
]

Promise.all(configs.map((config) => esbuild.build(config)))
