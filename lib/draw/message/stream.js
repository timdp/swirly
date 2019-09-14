const { draw: drawNonStreamMessage } = require('./non-stream')
const { createDrawStream } = require('../stream-factory')
const { degreesToRadians } = require('../../util/degrees-to-radians')
const { rotateRectangle, translateRectangle } = require('../../util/geometry')
const { rotate, translate } = require('../../util/transform')

const supports = ({ notification: { value } }) =>
  value != null && typeof value === 'object'

const drawStreamImpl = createDrawStream(drawNonStreamMessage)

const createScaleTime = higherOrderAngleDegrees => {
  const scale = 1 / Math.cos(degreesToRadians(higherOrderAngleDegrees))
  return time => time * scale
}

const draw = (ctx, { frame, notification: { value } }) => {
  const { styles } = ctx
  const x = frame * styles.frame_width

  const scaleTime = createScaleTime(styles.higher_order_angle)

  const { element: $group, bbox } = drawStreamImpl(ctx, scaleTime, value)

  rotate($group, styles.higher_order_angle, x, styles.event_radius)
  translate($group, x, 0)

  const rotatedBBox = rotateRectangle(
    bbox,
    degreesToRadians(styles.higher_order_angle),
    0,
    styles.event_radius
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
