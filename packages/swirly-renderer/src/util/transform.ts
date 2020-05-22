export const transform = ($element: SVGElement, value: string) => {
  const existing = $element.getAttribute('transform')
  const updated =
    (existing != null && existing !== '' ? existing + ' ' : '') + value
  $element.setAttribute('transform', updated)
}

export const translate = ($element: SVGElement, x: number, y: number) => {
  if (x === 0 && y === 0) {
    return
  }
  transform($element, `translate(${x} ${y})`)
}

export const rotate = (
  $element: SVGElement,
  angle: number,
  x: number = 0,
  y: number = 0
) => {
  if (angle === 0) {
    return
  }
  transform($element, `rotate(${angle} ${x} ${y})`)
}
