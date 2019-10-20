const transform = ($element, value) => {
  const existing = $element.getAttribute('transform')
  const updated =
    (existing != null && existing !== '' ? existing + ' ' : '') + value
  $element.setAttribute('transform', updated)
}

const translate = ($element, x, y) => {
  if (x === 0 && y === 0) {
    return
  }
  transform($element, `translate(${x} ${y})`)
}

const rotate = ($element, angle, x = 0, y = 0) => {
  if (angle === 0) {
    return
  }
  transform($element, `rotate(${angle} ${x} ${y})`)
}

module.exports = {
  transform,
  translate,
  rotate
}
