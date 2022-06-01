// Although XMLDocument is supposed to be generic, it actually inherits from
// Document, which partly assumes HTML, including for documentElement.
export type SVGDocument = XMLDocument & {
  documentElement: SVGSVGElement
}

export type DiagramRendering = {
  document: SVGDocument
  width: number
  height: number
}
