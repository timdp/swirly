#!/usr/bin/env node

require('hard-rejection/register')
const fs = require('fs-extra')
const path = require('path')

const PKG_ROOT = '..'

const listCandidateReferences = async () => {
  const pkgs = []
  const ents = await fs.readdir(PKG_ROOT, { withFileTypes: true })
  await Promise.all(
    ents.map(async ent => {
      if (!ent.isDirectory()) {
        return
      }

      const dir = path.join(PKG_ROOT, ent.name)

      let name, tsBuildInfoFile
      try {
        const [pkg, tsconfig] = await Promise.all([
          fs.readJson(path.join(dir, 'package.json')),
          fs.readJson(path.join(dir, 'tsconfig.json'))
        ])
        name = pkg.name
        tsBuildInfoFile = tsconfig.compilerOptions.tsBuildInfoFile
      } catch {
        return
      }

      if (tsBuildInfoFile == null) {
        return
      }

      pkgs.push({
        path: dir,
        name
      })
    })
  )
  return pkgs
}

const pkgToDependencies = pkg => {
  const { dependencies = {}, devDependencies = {} } = pkg
  return [...Object.keys(dependencies), ...Object.keys(devDependencies)]
}

const dependenciesToKnownPaths = (allDepNames, pkgs) =>
  allDepNames
    .map(name => pkgs.find(pkg => pkg.name === name))
    .filter(Boolean)
    .map(pkg => pkg.path)

const main = async () => {
  const [pkg, tsconfig, pkgs] = await Promise.all([
    fs.readJson('package.json'),
    fs.readJson('tsconfig.json'),
    listCandidateReferences()
  ])
  if (tsconfig.references == null) {
    tsconfig.references = []
  }

  const allDepNames = pkgToDependencies(pkg)
  const tsDepPaths = dependenciesToKnownPaths(allDepNames, pkgs)

  const missingTsDepPaths = tsDepPaths.filter(
    path => !tsconfig.references.some(ref => ref.path === path)
  )

  if (missingTsDepPaths.length === 0) {
    return
  }

  tsconfig.references.push(...missingTsDepPaths.map(path => ({ path })))
  tsconfig.references.sort((a, b) => a.path.localeCompare(b.path))
  await fs.writeJson('tsconfig.json', tsconfig, { spaces: 2 })
}

main()
