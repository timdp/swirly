import { streamParser } from '@swirly/parser'
import {
  Color,
  DiagramContent,
  OperatorSpecification,
  OperatorStyles,
  OperatorTitleSegment,
  StreamSpecification
} from '@swirly/types'

import { renderStreamBase } from './stream/core'
import {
  PostRenderUpdateContext,
  RendererContext,
  UpdatableRendererResult
} from './types'
import { mergeStyles } from './util/merge-styles'
import {
  createSvgDocument,
  createSvgElement,
  setSvgDimensions,
  XHTML_NS
} from './util/svg-xml'

const NON_BREAKING_SPACE = '\xA0'

const reSpace = / /g

const createRootDiv = (document: Document, styles: Record<string, any>) => {
  const $div = document.createElementNS(XHTML_NS, 'div')
  $div.setAttribute(
    'style',
    Object.entries(styles)
      .map(([name, value]) => `${name}: ${value};`)
      .join(' ')
  )
  return $div
}

const renderStream = (text: string, ctx: RendererContext) => {
  const content: DiagramContent = []
  streamParser.run([text], {
    content,
    diagramStyles: {},
    messageStyles: {},
    allValues: {}
  })
  const [spec] = content as StreamSpecification[]
  const {
    element: $group,
    bbox: { x2: width, y2: height }
  } = renderStreamBase(ctx, spec, false, false)
  return {
    $group,
    width,
    height
  }
}

const segmentRenderers = {
  text: (value: string, ctx: RendererContext) => {
    const $div = ctx.document.createElement('div')
    $div.textContent = value.replace(reSpace, NON_BREAKING_SPACE)
    return $div
  },
  stream: (value: string, ctx: RendererContext, styles: OperatorStyles) => {
    const { documentElement: $svg } = createSvgDocument(ctx.DOMParser)
    const { $group, width, height } = renderStream(value, ctx)
    setSvgDimensions($svg, width, height, (styles.stream_scale ?? 100) / 100)
    $svg.appendChild($group)
    return $svg
  }
}

const renderRichTitle = (
  segments: OperatorTitleSegment[],
  ctx: RendererContext,
  color: Color,
  styles: OperatorStyles,
  fontStyles: Record<string, any>
) => {
  const $foreignObject = createSvgElement(ctx.document, 'foreignObject', {
    y: styles.spacing,
    height: styles.height
  })
  const $container = createRootDiv(ctx.document, {
    width: '100%',
    height: '100%',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    color,
    ...fontStyles
  })
  $foreignObject.appendChild($container)
  for (const { type, value } of segments) {
    const $element = segmentRenderers[type](value, ctx, styles)
    $container.appendChild($element)
  }
  return $foreignObject
}

const renderTextTitle = (
  text: string,
  ctx: RendererContext,
  color: Color,
  styles: OperatorStyles,
  fontStyles: Record<string, any>
) =>
  createSvgElement(
    ctx.document,
    'text',
    {
      x: styles.spacing!,
      y: styles.spacing! + styles.height! / 2,
      fill: color,
      'dominant-baseline': 'middle',
      'text-anchor': 'middle',
      ...fontStyles
    },
    text
  )

const renderTitle = (
  segments: OperatorTitleSegment[],
  ctx: RendererContext,
  styles: OperatorStyles
) => {
  const color = styles.title_color!
  const fontStyles = {
    'font-family': styles.title_font_family!,
    'font-size': styles.title_font_size! + 'px',
    'font-weight': styles.title_font_weight!,
    'font-style': styles.title_font_style!
  }

  const isText = segments.length === 1 && segments[0].type === 'text'

  const $title = isText
    ? renderTextTitle(segments[0].value, ctx, color, styles, fontStyles)
    : renderRichTitle(segments, ctx, color, styles, fontStyles)

  return { $title, shouldCenter: isText }
}

export const renderOperator = (
  ctx: RendererContext,
  operator: OperatorSpecification
): UpdatableRendererResult => {
  const s: OperatorStyles = mergeStyles(
    ctx.styles,
    operator.styles,
    'operator_'
  )

  const $group = createSvgElement(ctx.document, 'g')

  const $rect = createSvgElement(ctx.document, 'rect', {
    x: 0,
    y: s.spacing!,
    width: 1,
    height: s.height! - s.stroke_width!,
    fill: s.fill_color!,
    stroke: s.stroke_color!,
    'stroke-width': s.stroke_width!,
    rx: s.corner_radius!
  })
  $group.appendChild($rect)

  const { $title, shouldCenter } = renderTitle(operator.title, ctx, s)
  $group.appendChild($title)

  const bbox = {
    x1: 0,
    y1: 0,
    x2: 1,
    y2: s.height! + 2 * s.spacing!
  }

  const update = ({ width }: PostRenderUpdateContext) => {
    $rect.setAttribute('width', String(width))
    $title.setAttribute('width', String(width))
    if (shouldCenter) {
      $title.setAttribute('x', String(width / 2))
    }
  }

  return {
    element: $group,
    bbox,
    update
  }
}
