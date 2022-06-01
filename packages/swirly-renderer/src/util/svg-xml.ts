import { SVGDocument } from '@swirly/types'

const SVG_NS = 'http://www.w3.org/2000/svg'
const SVG_MIME_TYPE = 'image/svg+xml'
const EMPTY_SVG_XML = `<svg xmlns="${SVG_NS}"/>`

const parseXml = (
  xml: string,
  mimeType: string,
  DOMParserImpl: typeof DOMParser = DOMParser
) => new DOMParserImpl().parseFromString(xml, mimeType as any) as XMLDocument

export const createSvgDocument = (DOMParserImpl?: typeof DOMParser) =>
  parseXml(EMPTY_SVG_XML, SVG_MIME_TYPE, DOMParserImpl) as SVGDocument

export const createSvgElement = (
  document: SVGDocument,
  name: string,
  attrs: Record<string, any> = {},
  text: string = ''
): SVGElement => {
  const $el = document.createElementNS(SVG_NS, name)
  for (const [name, value] of Object.entries(attrs)) {
    $el.setAttribute(name, String(value))
  }
  if (text !== '') {
    $el.textContent = text
  }
  return $el
}
