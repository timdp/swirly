const { drawArrow } = require('./arrow')
const { drawDecoration } = require('./decoration')
const { createElement } = require('../util/create-element')
const { rectangleUnion } = require('../util/geometry')

const createDrawObservable = drawNotification => (
  ctx,
  scaleTime,
  { duration, notifications, decorations }
) => {
  const { document } = ctx

  const innerCtx = {
    ...ctx,
    scaleTime
  }

  const $group = createElement(document, 'g')
  const bboxes = []

  const add = ({ element, bbox }) => {
    $group.appendChild(element)
    bboxes.push(bbox)
  }

  add(drawArrow(innerCtx, { duration: scaleTime(duration) }))

  for (const notification of notifications || []) {
    add(
      drawNotification(innerCtx, {
        ...notification,
        frame: scaleTime(notification.frame)
      })
    )
  }

  innerCtx.bbox = rectangleUnion(bboxes)

  for (const decoration of decorations || []) {
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

module.exports = { createDrawObservable }
