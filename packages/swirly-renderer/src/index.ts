import { styles as defaultStyles } from '@swirly/theme-default-light'
import {
  DiagramRendering,
  DiagramSpecification,
  OperatorSpecification,
  StreamSpecification
} from '@swirly/types'

import { renderOperator } from './operator'
import { renderStream } from './stream'
import {
  RendererContext,
  RendererOptions,
  RendererResult,
  UpdatableRendererResult
} from './types'
import { createElement } from './util/create-element'
import { translate } from './util/transform'

const EMPTY_SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>'
const MIME_TYPE = 'image/svg+xml'

const renderMarbleDiagram = (
  spec: DiagramSpecification,
  options: RendererOptions = {}
): DiagramRendering => {
  const DOMParserImpl: typeof DOMParser =
    options.DOMParser != null ? options.DOMParser : DOMParser
  const parser: DOMParser = new DOMParserImpl()
  const document: XMLDocument = parser.parseFromString(EMPTY_SVG, MIME_TYPE)
  // XXX Typings for Document think it's HTML
  const $svg = (document.documentElement as unknown) as SVGSVGElement

  const styles = {
    ...defaultStyles,
    ...options.styles,
    ...spec.styles
  }

  const $group = createElement(document, 'g')
  translate($group, styles.canvas_padding!, styles.canvas_padding!)
  $svg.appendChild($group)

  const streamHeight = Math.max(
    styles.event_radius! * 2,
    styles.completion_height!,
    styles.error_size!
  )

  const ctx: RendererContext = { document, styles, streamHeight }

  const updaters = []

  let maxX = 0
  let y = 0
  for (const item of spec.content) {
    const rendererResult: RendererResult | UpdatableRendererResult =
      item.kind === 'O'
        ? renderOperator(ctx, item as OperatorSpecification)
        : renderStream(ctx, item as StreamSpecification)
    const { element, bbox, update } = rendererResult as UpdatableRendererResult

    translate(element, 0, y - bbox.y1)
    $group.appendChild(element)

    maxX = Math.max(maxX, bbox.x2)

    const height = bbox.y2 - bbox.y1
    y += height + styles.stream_spacing!

    if (update != null) {
      updaters.push(update)
    }
  }

  y -= styles.stream_spacing!

  const width = styles.canvas_padding! + maxX + styles.canvas_padding!
  const height = styles.canvas_padding! + y + styles.canvas_padding!

  $svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  $svg.setAttribute('width', '' + width)
  $svg.setAttribute('height', '' + height)

  const bgColor = styles.background_color!
  if (bgColor !== '' && bgColor !== 'transparent') {
    const $bg = createElement(document, 'rect', {
      x: 0,
      y: 0,
      width: '' + width,
      height: '' + height,
      fill: bgColor
    })
    $svg.insertBefore($bg, $svg.firstChild)
  }

  for (const update of updaters) {
    update({ width: maxX, height: y })
  }

  return {
    document,
    width,
    height
  }
}

export { renderMarbleDiagram, RendererOptions }
