#!/usr/bin/env node

require('hard-rejection/register')
const esbuild = require('esbuild')
const path = require('path')

const { version: VERSION } = require('../../../lerna.json')

const SRC = path.resolve(__dirname, '../src')
const DIST = path.resolve(__dirname, '../dist')

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
