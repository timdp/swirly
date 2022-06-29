import { lightStyles } from '@swirly/theme-default-light'
import {
  DiagramRendering,
  DiagramSpecification,
  OperatorSpecification,
  StreamSpecification
} from '@swirly/types'

import { renderOperator } from './operator.js'
import { renderStream } from './stream/full.js'
import {
  RendererContext,
  RendererOptions,
  RendererResult,
  UpdatableRendererResult
} from './types.js'
import {
  createSvgDocument,
  createSvgElement,
  setSvgDimensions
} from './util/svg-xml.js'
import { translate } from './util/transform.js'

const isOperator = (item: StreamSpecification | OperatorSpecification) =>
  item.kind === 'O'

const isStream = (item: StreamSpecification | OperatorSpecification) =>
  !isOperator(item)

const renderMarbleDiagram = (
  spec: DiagramSpecification,
  options: RendererOptions = {}
): DiagramRendering => {
  const styles = {
    ...lightStyles,
    ...options.styles,
    ...spec.styles
  }

  const document = createSvgDocument(options.DOMParser)
  const $svg = document.documentElement

  const $group = createSvgElement(document, 'g')
  translate($group, styles.canvas_padding!, styles.canvas_padding!)
  $svg.appendChild($group)

  const streamHeight = Math.max(
    styles.event_radius! * 2,
    styles.completion_height!,
    styles.error_size!
  )

  const streamTitleEnabled = spec.content.some(
    (item) => isStream(item) && item.title != null && item.title !== ''
  )

  const ctx: RendererContext = {
    DOMParser: options.DOMParser,
    document,
    styles,
    streamHeight,
    streamTitleEnabled
  }

  const updaters = []

  let maxX = 0
  let y = 0
  for (const item of spec.content) {
    const rendererResult: RendererResult = isOperator(item)
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

  setSvgDimensions($svg, width, height)

  const bgColor = styles.background_color!
  if (bgColor !== '' && bgColor !== 'transparent') {
    const $bg = createSvgElement(document, 'rect', {
      x: 0,
      y: 0,
      width,
      height,
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

export { RendererOptions, renderMarbleDiagram }
