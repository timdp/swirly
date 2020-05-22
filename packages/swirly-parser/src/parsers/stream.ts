// @ts-ignore
import { TestScheduler } from 'rxjs/testing'

import { toStreamSpec } from '../spec/stream'
import { Parser, ParserContext } from '../types'
import { firstNonNull } from '../util/first-non-null'
import { parseConfig } from './config'

const reName = /([A-Za-z0-9])/g
const reNameAndMarbles = /^([A-Za-z0-9])\s*=\s*(\S+)\s*$/

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
  configValues: { [key: string]: any },
  allValues: { [key: string]: any }
): any => {
  const localValues: any = {}
  for (const name of extractNames(marbles)) {
    localValues[name] = firstNonNull(configValues[name], allValues[name], name)
  }
  return localValues
}

const match = () => true

const run = (lines: string[], { content, allValues }: ParserContext) => {
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

export const streamParser: Parser = {
  match,
  run
}
