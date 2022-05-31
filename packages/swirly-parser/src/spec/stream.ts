import { TestMessage } from '@swirly/parser-rxjs'
import {
  CompletionMessageSpecification,
  ErrorMessageSpecification,
  MessageSpecification,
  ScalarNextMessageSpecification,
  StreamNextMessageSpecification,
  StreamSpecification
} from '@swirly/types'

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
  notification
}: TestMessage): MessageSpecification => {
  const frame = unscaledFrame * SCALE
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
          value: createStreamSpecification(value)
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

export const createStreamSpecification = (
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
