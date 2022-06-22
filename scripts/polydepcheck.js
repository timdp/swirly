#!/usr/bin/env node

require('hard-rejection/register')

const chalk = require('chalk')
const depcheck = require('depcheck')
const fs = require('fs-extra')
const globby = require('globby')
const micromatch = require('micromatch')
const minimist = require('minimist')
const pMap = require('p-map')
const readPackage = require('read-pkg')
const os = require('os')

const DEFAULT_CONFIG = {
  ignoreMissing: {},
  ignoreUnused: {},
  ignorePatterns: [],
  concurrency: os.cpus().length,
  verbose: false
}

const filter = (depNames, pkgName, ignores) => {
  const patterns = [...(ignores['*'] ?? []), ...(ignores[pkgName] ?? [])]
  if (patterns.length === 0) {
    return depNames
  }
  return micromatch.not(depNames, patterns)
}

const print = (
  pkgNameFixed,
  style,
  label,
  depNames = null,
  isError = false
) => {
  ;(isError ? console.error : console.info)(
    style('■') +
      ' ' +
      pkgNameFixed +
      ' ' +
      style(label) +
      (depNames != null ? ' ' + depNames.join(' ') : '')
  )
}

const checkAndReport = async (pkgDir, pkgName, config, pkgColWidth) => {
  const pkgNameFixed = pkgName.padEnd(pkgColWidth)
  const { dependencies, devDependencies, missing } = await depcheck(pkgDir, {
    ignorePatterns: config.ignorePatterns
  })
  const missingNames = filter(
    Object.keys(missing),
    pkgName,
    config.ignoreMissing
  )
  if (missingNames.length > 0) {
    print(pkgNameFixed, chalk.red, 'Missing:', missingNames, true)
  }
  const unusedNames = filter(
    [...dependencies, ...devDependencies],
    pkgName,
    config.ignoreUnused
  )
  if (unusedNames.length > 0) {
    print(pkgNameFixed, chalk.yellow, 'Unused:', unusedNames, true)
  }
  const failureCount = missingNames.length + unusedNames.length
  if (config.verbose && failureCount === 0) {
    print(pkgNameFixed, chalk.green, 'OK')
  }
  return failureCount
}

const buildConfig = async () => {
  let rcConfig = null
  try {
    rcConfig = await fs.readJson('.polydepcheckrc.json')
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
  const config = { ...DEFAULT_CONFIG, ...rcConfig }
  const argv = minimist(process.argv.slice(2))
  // TODO Support other options
  if (typeof argv.verbose === 'boolean') {
    config.verbose = argv.verbose
  }
  return config
}

const main = async () => {
  const config = await buildConfig()
  const { workspaces } = await readPackage()
  const pkgDirs = await globby(workspaces, {
    onlyDirectories: true,
    absolute: true
  })
  const pkgNames = await pMap(
    pkgDirs,
    async (pkgDir) => (await readPackage({ cwd: pkgDir })).name,
    { concurrency: config.concurrency }
  )
  const pkgColWidth = pkgNames.reduce(
    (max, pkgName) => Math.max(max, pkgName.length),
    0
  )
  const results = await pMap(
    pkgDirs,
    async (pkgDir, index) =>
      await checkAndReport(pkgDir, pkgNames[index], config, pkgColWidth),
    { concurrency: config.concurrency }
  )
  if (results.some(Boolean)) {
    process.exit(1)
  }
}

main()
