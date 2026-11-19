import { renderMarbleDiagram as renderMarbleDiagramBase } from '@swirly/renderer'
import {
  DiagramRendering,
  DiagramSpecification,
  RendererOptions,
} from '@swirly/types'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'

type NodeDiagramRendering = DiagramRendering & { xml: string }
type XmlNode = Parameters<XMLSerializer['serializeToString']>[0]

export const renderMarbleDiagram = (
  spec: DiagramSpecification,
  options: RendererOptions = {}
): NodeDiagramRendering => {
  const result: DiagramRendering = renderMarbleDiagramBase(spec, {
    DOMParser: DOMParser as unknown as typeof globalThis.DOMParser,
    ...options,
  })
  const svgRoot = result.document.documentElement
  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(svgRoot as unknown as XmlNode)
  return {
    ...result,
    xml,
  }
}
