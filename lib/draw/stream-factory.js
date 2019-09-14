const { drawArrow } = require('./arrow')
const { drawDecoration } = require('./decoration')
const { createElement } = require('../util/create-element')
const { rectangleUnion } = require('../util/geometry')
const { mergeStyles } = require('../util/merge-styles')

const createDrawStream = drawMessage => (ctx, scaleTime, stream) => {
  const $group = createElement(ctx.document, 'g')
  const bboxes = []

  const add = ({ element, bbox }) => {
    $group.appendChild(element)
    bboxes.push(bbox)
  }

  const arrowStyles = mergeStyles('arrow_', ctx.styles, stream)
  const scaledDuration = scaleTime(stream.duration)
  add(drawArrow(ctx, arrowStyles, scaledDuration))

  const innerCtx = {
    ...ctx,
    scaleTime
  }

  for (const message of stream.messages || []) {
    add(
      drawMessage(innerCtx, {
        ...message,
        frame: scaleTime(message.frame)
      })
    )
  }

  innerCtx.bbox = rectangleUnion(bboxes)

  for (const decoration of stream.decorations || []) {
    const { element, bbox } = drawDecoration(innerCtx, decoration)
    $group.appendChild(element)
    if (bbox != null) {
      innerCtx.bbox = rectangleUnion([innerCtx.bbox, bbox])
    }
  }

  return {
    element: $group,
    bbox: innerCtx.bbox
  }
}

module.exports = { createDrawStream }
