import {
  RendererOptions,
  renderMarbleDiagram as renderMarbleDiagramBase
} from '@swirly/renderer'
import { DiagramRendering, DiagramSpecification } from '@swirly/types'
// @ts-ignore
import { DOMParser, XMLSerializer } from 'xmldom'

type NodeDiagramRendering = DiagramRendering & { xml: string }

export const renderMarbleDiagram = (
  spec: DiagramSpecification,
  options: RendererOptions = {}
): NodeDiagramRendering => {
  const result: DiagramRendering = renderMarbleDiagramBase(spec, {
    DOMParser,
    ...options
  })
  // XXX Typings for Document think it's HTML
  const svgRoot = result.document.documentElement as unknown as SVGSVGElement
  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(svgRoot)
  return {
    ...result,
    xml
  }
}
