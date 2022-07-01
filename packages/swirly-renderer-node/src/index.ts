import { renderMarbleDiagram as renderMarbleDiagramBase } from '@swirly/renderer'
import {
  DiagramRendering,
  DiagramSpecification,
  RendererOptions
} from '@swirly/types'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'

type NodeDiagramRendering = DiagramRendering & { xml: string }

export const renderMarbleDiagram = (
  spec: DiagramSpecification,
  options: RendererOptions = {}
): NodeDiagramRendering => {
  const result: DiagramRendering = renderMarbleDiagramBase(spec, {
    DOMParser,
    ...options
  })
  const svgRoot = result.document.documentElement
  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(svgRoot)
  return {
    ...result,
    xml
  }
}
