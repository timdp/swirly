const { drawArrow } = require('./arrow')
const { drawDecoration } = require('./decoration')
const { createElement } = require('../util/create-element')
const { degreesToRadians } = require('../util/degrees-to-radians')
const { rectangleUnion } = require('../util/geometry')
const { mergeStyles } = require('../util/merge-styles')
const { translate } = require('../util/transform')

const nullScaleTime = time => time

const createScaleTime = higherOrderAngleDegrees => {
  const scale = 1 / Math.cos(degreesToRadians(higherOrderAngleDegrees))
  return time => time * scale
}

const isNotification = ({ notification: { kind } }) =>
  kind == null || ['N', 'notification'].includes(kind)

const countPriors = (message, index, messages) => {
  let count = 0
  for (let i = 0; i < index; ++i) {
    if (isNotification(messages[i]) && messages[i].frame === message.frame) {
      ++count
    }
  }
  return count
}

const createDrawStream = drawMessage => (ctx, isHigherOrder, stream) => {
  const { document, styles } = ctx

  const scaleTime = isHigherOrder
    ? createScaleTime(styles.higher_order_angle)
    : nullScaleTime

  const $group = createElement(document, 'g')
  const bboxes = []

  const add = ({ element, bbox }) => {
    $group.appendChild(element)
    bboxes.push(bbox)
  }

  const arrowStyles = mergeStyles('arrow_', styles, stream.styles)
  const scaledDuration = scaleTime(stream.duration)
  add(drawArrow(ctx, arrowStyles, scaledDuration))

  for (let i = stream.messages.length - 1; i >= 0; --i) {
    const message = stream.messages[i]
    const scaledMessage = {
      ...message,
      frame: scaleTime(message.frame)
    }

    const priorCount = isNotification(message)
      ? countPriors(message, i, stream.messages)
      : 0
    const dy = priorCount * styles.stacking_height

    const valueAngle = isHigherOrder ? styles.higher_order_event_value_angle : 0

    const options = {
      verticalOffset: dy,
      valueAngle
    }

    const { element, bbox } = drawMessage(ctx, scaledMessage, options)

    translate(element, 0, dy)
    bbox.y2 += dy

    add({ element, bbox })
  }

  const innerCtx = {
    ...ctx,
    scaleTime,
    bbox: rectangleUnion(bboxes)
  }

  if (stream.decorations != null) {
    for (const decoration of stream.decorations) {
      const { element, bbox } = drawDecoration(innerCtx, decoration)
      $group.appendChild(element)
      if (bbox != null) {
        innerCtx.bbox = rectangleUnion([innerCtx.bbox, bbox])
      }
    }
  }

  return {
    element: $group,
    bbox: innerCtx.bbox
  }
}

module.exports = { createDrawStream }
