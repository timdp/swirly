const { TestScheduler } = require('rxjs/testing')
const { parseConfig } = require('./config')
const { toStreamSpec } = require('../spec/stream')
const { firstNonNull } = require('../util/first-non-null')

const reName = /([A-Za-z0-9])/g
const reNameAndMarbles = /^([A-Za-z0-9])\s*=\s*(\S+)\s*$/

const extractNames = marbles => {
  const names = []

  let match
  while ((match = reName.exec(marbles)) != null) {
    names.push(match[1])
  }

  return names
}

const parseNameAndMarbles = nameAndMarbles => {
  const match = reNameAndMarbles.exec(nameAndMarbles)

  if (match != null) {
    const [, name, marbles] = match
    return [name, marbles]
  }

  return [null, nameAndMarbles]
}

const buildLocalValues = (marbles, configValues, allValues) => {
  const localValues = {}
  for (const name of extractNames(marbles)) {
    localValues[name] = firstNonNull(configValues[name], allValues[name], name)
  }
  return localValues
}

const match = () => true

const run = (lines, { content, allValues }) => {
  const [nameAndMarbles, ...configLines] = lines

  const [name, marbles] = parseNameAndMarbles(nameAndMarbles)
  const config = parseConfig(configLines, true)

  const localValues = buildLocalValues(marbles, config.values, allValues)

  const messages = TestScheduler.parseMarbles(marbles, localValues)

  if (name != null) {
    allValues[name] = messages
  } else {
    const spec = toStreamSpec(messages, config.title)
    content.push(spec)
  }
}

const streamParser = {
  match,
  run
}

module.exports = { streamParser }
