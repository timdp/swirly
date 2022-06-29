#!/usr/bin/env node

import 'hard-rejection/register.js'

import esbuild from 'esbuild'
import fs from 'fs-extra'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '../src')
const DIST = path.resolve(__dirname, '../dist')
const { version: VERSION } = await fs.readJson(
  path.resolve(__dirname, '../../../lerna.json')
)

const baseConfig = {
  target: 'es2020',
  entryPoints: [path.resolve(SRC, 'app.ts')],
  bundle: true,
  define: {
    VERSION: JSON.stringify(VERSION)
  }
}

const configs = [
  {
    ...baseConfig,
    outfile: path.resolve(DIST, 'bundle.js'),
    minify: false,
    sourcemap: 'inline'
  },
  {
    ...baseConfig,
    outfile: path.resolve(DIST, 'bundle.min.js'),
    minify: true,
    sourcemap: false
  }
]

Promise.all(configs.map((config) => esbuild.build(config)))
