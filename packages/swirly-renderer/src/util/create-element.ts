export const createElement = (
  document: XMLDocument,
  name: string,
  attrs: any = {},
  text: string = ''
): SVGElement => {
  const $el = document.createElementNS('http://www.w3.org/2000/svg', name)

  for (const [name, value] of Object.entries(attrs)) {
    $el.setAttribute(name, '' + value)
  }

  if (text !== '') {
    $el.textContent = '' + text
  }

  return $el
}
