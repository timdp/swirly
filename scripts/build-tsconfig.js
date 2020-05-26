#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const PKG_ROOT = '../'
const PKG_NAME_PREFIX = 'swirly-'

const cwd = process.cwd()
const pkgPath = path.join(cwd, 'package.json')
const tsconfigPath = path.join(cwd, 'tsconfig.json')

// Read tsconfig.json if it exists
let tsconfig
try {
  tsconfig = require(tsconfigPath)
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    // Unexpected error, crash
    throw err
  }
  // Not a TypeScript module, abort
  process.exit()
}

// Ensure tsconfig.references is an array so we can update it
if (tsconfig.references == null) {
  tsconfig.references = []
}

// Read package.json
const pkg = require(pkgPath)
const { dependencies = {}, devDependencies = {} } = pkg

// Tracks whether tsconfig.json is going to be written
let updated = false

// List monorepo references in package.json
const refPkgNames = Object.keys({ ...dependencies, ...devDependencies }).filter(
  name => name.startsWith(PKG_NAME_PREFIX)
)

// Add monorepo references found in package.json but not tsconfig.json
const refPaths = tsconfig.references.map(ref => ref.path)
const missingRefNames = refPkgNames.filter(
  name => !refPaths.includes(PKG_ROOT + name)
)
if (missingRefNames.length > 0) {
  tsconfig.references.push(
    ...missingRefNames.map(name => ({ path: PKG_ROOT + name }))
  )
  updated = true
}

// Remove monorepo references found in tsconfig.json but not package.json
const prunedRefs = tsconfig.references.filter(
  ref =>
    !ref.path.startsWith(PKG_ROOT + PKG_NAME_PREFIX) ||
    refPkgNames.includes(ref.path.substr(PKG_ROOT.length))
)
if (prunedRefs.length !== tsconfig.references.length) {
  tsconfig.references = prunedRefs
  updated = true
}

// Update tsconfig.json if modified
if (updated) {
  tsconfig.references.sort((a, b) => a.path.localeCompare(b.path))
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8')
}
