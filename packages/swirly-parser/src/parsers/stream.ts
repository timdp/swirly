import { parseMarbles } from '@swirly/parser-rxjs'

import { createStreamSpecification } from '../spec/stream'
import { kIsGhost } from '../symbols'
import { Parser, ParserContext } from '../types'
import { firstNonNull } from '../util/first-non-null'
import { parseConfig } from './config'

const reName = /([A-Za-z0-9])/g
const reNameAndMarbles = /^([A-Za-z0-9])\s*=\s*(\S+)\s*$/
const reLeadingWhitespace = /^(\s+)/
const reGhostNameSeparator = /\s*,\s*/

function * extractNames (marbles: string): Generator<string, void, undefined> {
  let match
  while ((match = reName.exec(marbles)) != null) {
    yield match[1]
  }
}

const parseNameAndMarbles = (
  nameAndMarbles: string
): [string | null, string] => {
  const match = reNameAndMarbles.exec(nameAndMarbles)

  if (match != null) {
    const [, name, marbles] = match
    return [name, marbles]
  }

  return [null, nameAndMarbles]
}

const buildLocalValues = (
  marbles: string,
  configValues: Record<string, any>,
  allValues: Record<string, any>
): any => {
  const localValues: any = {}
  for (const name of extractNames(marbles)) {
    localValues[name] = firstNonNull(configValues[name], allValues[name], name)
  }
  return localValues
}

const match = () => true

const run = (
  lines: readonly string[],
  { content, allValues }: ParserContext
) => {
  const [nameAndMarbles, ...configLines] = lines

  const [name, marbles] = parseNameAndMarbles(nameAndMarbles)
  const config = parseConfig(configLines, true)

  const localValues = buildLocalValues(marbles, config.values, allValues)
  if (typeof config.ghosts === 'string') {
    const ghostNames = config.ghosts.split(reGhostNameSeparator)
    for (const ghostName of ghostNames) {
      if (localValues[ghostName] != null) {
        const copy = localValues[ghostName].slice()
        copy[kIsGhost] = true
        localValues[ghostName] = copy
      }
    }
  }
  const messages = parseMarbles(marbles, localValues)

  const match = reLeadingWhitespace.exec(marbles)
  const frame = match != null ? match[0].length : 0

  if (name != null) {
    allValues[name] = messages
  } else {
    const spec = createStreamSpecification(messages, config.title, frame)
    content.push(spec)
  }
}

export const streamParser: Parser = {
  match,
  run
}
