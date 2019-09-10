const { drawArrow } = require('./arrow')
const { drawDecoration } = require('./decoration')
const { createElement } = require('../util/create-element')
const { rectangleUnion } = require('../util/geometry')
const { mergeStyles } = require('../util/merge-styles')

const createDrawObservable = drawNotification => (
  ctx,
  scaleTime,
  observable
) => {
  const $group = createElement(ctx.document, 'g')
  const bboxes = []

  const add = ({ element, bbox }) => {
    $group.appendChild(element)
    bboxes.push(bbox)
  }

  const arrowStyles = mergeStyles('arrow_', ctx.styles, observable)
  const scaledDuration = scaleTime(observable.duration)
  add(drawArrow(ctx, arrowStyles, scaledDuration))

  const innerCtx = {
    ...ctx,
    scaleTime
  }

  for (const notification of observable.notifications || []) {
    add(
      drawNotification(innerCtx, {
        ...notification,
        frame: scaleTime(notification.frame)
      })
    )
  }

  innerCtx.bbox = rectangleUnion(bboxes)

  for (const decoration of observable.decorations || []) {
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
