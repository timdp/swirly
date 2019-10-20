const {
  supports: supportsNonStreamMessage,
  draw: drawNonStreamMessage
} = require('./non-stream')
const { createDrawStream } = require('../stream-factory')
const { degreesToRadians } = require('../../util/degrees-to-radians')
const { rotateRectangle, translateRectangle } = require('../../util/geometry')
const { rotate, translate } = require('../../util/transform')

const supports = message => !supportsNonStreamMessage(message)

const drawStreamImpl = createDrawStream(drawNonStreamMessage)

const draw = (ctx, { frame, notification: { value } }, { verticalOffset }) => {
  const { styles, streamHeight } = ctx
  const x = frame * styles.frame_width
  const y = streamHeight / 2 + verticalOffset

  const { element: $group, bbox } = drawStreamImpl(ctx, true, value)

  rotate($group, styles.higher_order_angle, x, y)
  translate($group, x, 0)

  const rotatedBBox = rotateRectangle(
    bbox,
    degreesToRadians(styles.higher_order_angle),
    0,
    y
  )
  const translatedBBox = translateRectangle(rotatedBBox, x, 0)

  return {
    element: $group,
    bbox: translatedBBox
  }
}

module.exports = {
  supports,
  draw
}
