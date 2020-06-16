import { TestMessage } from 'swirly-parser-rxjs'
import {
  CompletionMessageSpecification,
  ErrorMessageSpecification,
  MessageSpecification,
  ScalarNextMessageSpecification,
  StreamNextMessageSpecification,
  StreamSpecification
} from 'swirly-types'

import { SCALE } from '../constants'

const getDuration = (messages: readonly MessageSpecification[]): number => {
  let maxFrame = 0

  const walk = (messages: readonly MessageSpecification[], delta: number) => {
    for (const { frame, notification } of messages) {
      const frameAbs = delta + frame
      if ('value' in notification && Array.isArray(notification.value)) {
        walk(notification.value, frameAbs)
      } else if (frameAbs > maxFrame) {
        maxFrame = frameAbs
      }
    }
  }

  walk(messages, 0)

  return maxFrame
}

const testMessageToMessageSpecification = ({
  frame: unscaledFrame,
  notification: { kind, value }
}: TestMessage): MessageSpecification => {
  const frame = unscaledFrame * SCALE
  switch (true) {
    case kind === 'C':
      return { frame, notification: { kind } } as CompletionMessageSpecification
    case kind === 'E':
      return { frame, notification: { kind } } as ErrorMessageSpecification
    case Array.isArray(value):
      return {
        frame,
        notification: { kind: 'N', value: toStreamSpec(value) }
      } as StreamNextMessageSpecification
    default:
      return {
        frame,
        notification: {
          kind: 'N',
          value: value != null ? '' + value : ''
        }
      } as ScalarNextMessageSpecification
  }
}

export const toStreamSpec = (
  messagesIn: readonly TestMessage[],
  title: string | null = null,
  frame: number = 0
): StreamSpecification => {
  const messagesOut = messagesIn.map(testMessageToMessageSpecification)
  for (const message of messagesOut) {
    message.frame -= frame
  }
  return {
    kind: 'S',
    title,
    frame,
    duration: getDuration(messagesOut),
    messages: messagesOut
  }
}
