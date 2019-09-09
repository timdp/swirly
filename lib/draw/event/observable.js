const degreesToRadians = require('degrees-radians')
const { draw: drawNonObservableEvent } = require('./non-observable')
const { createDrawObservable } = require('../observable-factory')
const { rotate, translate } = require('../../util/transform')
const { rotateRectangle, translateRectangle } = require('../../util/geometry')

const supports = event => event.observable != null

const drawObservableImpl = createDrawObservable(drawNonObservableEvent)

const createScaleTime = higherOrderAngleDegrees => {
  const scale = 1 / Math.cos(degreesToRadians(higherOrderAngleDegrees))
  return time => time * scale
}

const draw = (ctx, { timestamp, observable }) => {
  const { styles } = ctx
  const x = timestamp * styles.time_unit_size

  const scaleTime = createScaleTime(styles.higher_order_angle)

  const { element: $group, bbox } = drawObservableImpl(
    ctx,
    scaleTime,
    observable
  )

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
