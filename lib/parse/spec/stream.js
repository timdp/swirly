const { ItemKind } = require('../../util/item-kind')
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

const toStreamSpec = (messagesIn, title = null) => {
  const messagesOut = messagesIn.map(
    ({ frame, notification: { kind, value } }) => ({
      frame: frame * SCALE,
      notification: {
        value:
          value == null
            ? ''
            : Array.isArray(value)
              ? toStreamSpec(value)
              : value,
        kind
      }
    })
  )

  return {
    kind: ItemKind.STREAM,
    title,
    duration: getDuration(messagesOut),
    messages: messagesOut
  }
}

module.exports = { toStreamSpec }
