import { MessageSpecification, StreamSpecification } from '@swirly/types'

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

export const createStreamSpecification = (
  messages: MessageSpecification[],
  title: string | null = null,
  frame: number = 0
): StreamSpecification => ({
  kind: 'S',
  title,
  frame,
  duration: getDuration(messages),
  messages
})
