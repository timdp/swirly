const translatePoint = (x, y, dx, dy) => ({
  x: x + dx,
  y: y + dy
})

const translateRectangle = ({ x1, y1, x2, y2 }, dx, dy) => {
  const p1 = translatePoint(x1, y1, dx, dy)
  const p2 = translatePoint(x2, y2, dx, dy)
  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y
  }
}

const rotatePoint = (x, y, angle, x0, y0) => {
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  x -= x0
  y -= y0
  return {
    x: x * c - y * s + x0,
    y: x * s + y * c + y0
  }
}

const rotateRectangle = ({ x1, y1, x2, y2 }, angle, x0, y0) => {
  const p1 = rotatePoint(x1, y1, angle, x0, y0)
  const p2 = rotatePoint(x2, y2, angle, x0, y0)
  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y
  }
}

const rectangleUnion = rects => {
  const nonEmptyRects = rects.filter(
    ({ x1, y1, x2, y2 }) => x2 - x1 !== 0 && y2 - y1 !== 0
  )
  if (nonEmptyRects.length === 0) {
    throw new Error('All rectangles empty')
  }
  return {
    x1: Math.min(...nonEmptyRects.map(rect => rect.x1)),
    y1: Math.min(...nonEmptyRects.map(rect => rect.y1)),
    x2: Math.max(...nonEmptyRects.map(rect => rect.x2)),
    y2: Math.max(...nonEmptyRects.map(rect => rect.y2))
  }
}

module.exports = {
  translatePoint,
  translateRectangle,
  rotatePoint,
  rotateRectangle,
  rectangleUnion
}
