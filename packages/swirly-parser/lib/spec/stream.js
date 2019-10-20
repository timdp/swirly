const { SCALE } = require('../constants')

const getDuration = messages => {
  let maxFrame = 0

  const walk = (messages, delta) => {
    for (const {
      frame,
      notification: { value }
    } of messages) {
      const frameAbs = delta + frame
      if (Array.isArray(value)) {
        walk(value, frameAbs)
      } else if (frameAbs > maxFrame) {
        maxFrame = frameAbs
      }
    }
  }

  walk(messages, 0)

  return maxFrame
}

const parseNotificationValue = value => {
  if (value == null) {
    return ''
  }
  if (Array.isArray(value)) {
    return toStreamSpec(value)
  }
  return value
}

const toStreamSpec = (messagesIn, title = null) => {
  const messagesOut = messagesIn.map(
    ({ frame, notification: { kind, value } }) => ({
      frame: frame * SCALE,
      notification: {
        value: parseNotificationValue(value),
        kind
      }
    })
  )

  return {
    kind: 'S',
    title,
    duration: getDuration(messagesOut),
    messages: messagesOut
  }
}

module.exports = { toStreamSpec }
