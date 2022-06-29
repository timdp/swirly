import { parseMarbles, TestMessage } from '@swirly/parser-rxjs'
import {
  CompletionMessageSpecification,
  ErrorMessageSpecification,
  MessageSpecification,
  ScalarNextMessageSpecification,
  ScalarNextMessageStyles,
  StreamNextMessageSpecification
} from '@swirly/types'

import { createStreamSpecification } from '../spec/stream.js'
import { kIsGhost } from '../symbols.js'
import { Parser, ParserContext } from '../types.js'
import { firstNonNull } from '../util/first-non-null.js'
import { invertObject } from '../util/invert-object.js'
import { parseConfig } from './config.js'

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
  allValues: Record<string, any>,
  ghostNames: string[]
): Record<string, any> => {
  const localValues: Record<string, any> = {}
  for (const name of extractNames(marbles)) {
    let value = firstNonNull(configValues[name], allValues[name], name)
    if (Array.isArray(value) && ghostNames.includes(name)) {
      value = value.slice()
      value[kIsGhost] = true
    }
    localValues[name] = value
  }
  return localValues
}

const testMessageToMessageSpecification = ({
  frame,
  notification
}: TestMessage): MessageSpecification => {
  const { kind, value } = notification as any
  switch (true) {
    case kind === 'C': // CompleteNotification
      return {
        frame,
        notification: { kind }
      } as CompletionMessageSpecification
    case kind === 'E': // ErrorNotification
      return { frame, notification: { kind } } as ErrorMessageSpecification
    case Array.isArray(value): // NextNotification, stream
      return {
        frame,
        notification: {
          kind: 'N',
          value: createStreamSpecification(value),
          isGhost: !!value[kIsGhost]
        }
      } as StreamNextMessageSpecification
    default: // NextNotification, scalar
      return {
        frame,
        notification: {
          kind: 'N',
          value: value != null ? String(value) : ''
        }
      } as ScalarNextMessageSpecification
  }
}

const testMessagesToMessageSpecifications = (
  testMessages: TestMessage[],
  frame: number,
  messageStyles: Record<string, ScalarNextMessageStyles>,
  valueToLocal: Record<string, string>
): MessageSpecification[] => {
  const messageSpecs = testMessages.map(testMessageToMessageSpecification)
  for (const message of messageSpecs) {
    message.frame -= frame
    if (message.notification.kind === 'N') {
      const { value } = (message as ScalarNextMessageSpecification).notification
      message.styles = messageStyles[valueToLocal[value] ?? value]
    }
  }
  return messageSpecs
}

const match = () => true

const run = (lines: readonly string[], ctx: ParserContext) => {
  const [nameAndMarbles, ...configLines] = lines

  const [name, marbles] = parseNameAndMarbles(nameAndMarbles)
  const config = parseConfig(configLines, true)

  const ghostNames =
    typeof config.ghosts === 'string'
      ? config.ghosts.split(reGhostNameSeparator)
      : []
  const localValues = buildLocalValues(
    marbles,
    config.values,
    ctx.allValues,
    ghostNames
  )

  const testMessages = parseMarbles(marbles, localValues)
  // RxJS TestScheduler.frameTimeFactor is 10, so undo that
  for (const message of testMessages) {
    message.frame = message.frame / 10
  }

  const match = reLeadingWhitespace.exec(marbles)
  const frame = match != null ? match[0].length : 0

  if (name != null) {
    ctx.allValues[name] = testMessages
  } else {
    // XXX Assumes values are unique
    const valueToLocal = invertObject(localValues)
    const messageSpecs = testMessagesToMessageSpecifications(
      testMessages,
      frame,
      ctx.messageStyles,
      valueToLocal
    )
    const streamSpec = createStreamSpecification(
      messageSpecs,
      config.title,
      frame
    )
    ctx.content.push(streamSpec)
  }
}

export const streamParser: Parser = {
  match,
  run
}
