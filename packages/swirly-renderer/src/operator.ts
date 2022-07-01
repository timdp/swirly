import {
  Color,
  OperatorSpecification,
  OperatorStyles,
  OperatorTitleSegment,
  StreamOperatorTitleSegment,
  StreamSpecification,
  TextOperatorTitleSegment
} from '@swirly/types'

import { renderStreamBase } from './stream/core.js'
import {
  PostRenderUpdateContext,
  RendererContext,
  UpdatableRendererResult
} from './types.js'
import { mergeStyles } from './util/merge-styles.js'
import {
  createSvgDocument,
  createSvgElement,
  setSvgDimensions,
  XHTML_NS
} from './util/svg-xml.js'
import { translate } from './util/transform.js'

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

const renderStream = (spec: StreamSpecification, ctx: RendererContext) => {
  const {
    element: $group,
    bbox: { x1, x2, y2 }
  } = renderStreamBase(ctx, spec, false, false)
  let width
  if (x1 < 0) {
    translate($group, -x1, 0)
    width = x2 - x1
  } else {
    width = x2
  }
  return {
    $group,
    width,
    height: y2
  }
}

const renderTextTitleSegment = (
  segment: TextOperatorTitleSegment,
  ctx: RendererContext
) => {
  const $div = ctx.document.createElement('div')
  $div.textContent = segment.value.replace(reSpace, NON_BREAKING_SPACE)
  return $div
}

const renderStreamTitleSegment = (
  segment: StreamOperatorTitleSegment,
  ctx: RendererContext,
  styles: OperatorStyles
) => {
  const { documentElement: $svg } = createSvgDocument(ctx.DOMParser)
  const { $group, width, height } = renderStream(segment.value, ctx)
  setSvgDimensions($svg, width, height, (styles.stream_scale ?? 100) / 100)
  $svg.appendChild($group)
  return $svg
}

const renderTitleSegment = (
  segment: OperatorTitleSegment,
  ctx: RendererContext,
  styles: OperatorStyles
) => {
  switch (segment.type) {
    case 'stream':
      return renderStreamTitleSegment(segment, ctx, styles)
    case 'text':
      return renderTextTitleSegment(segment, ctx)
    default:
      return null
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
    y: styles.spacing!,
    height: styles.height!
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
  for (const segment of segments) {
    const $element = renderTitleSegment(segment, ctx, styles)!
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
    ? renderTextTitle(
      (segments[0] as TextOperatorTitleSegment).value,
      ctx,
      color,
      styles,
      fontStyles
    )
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
    x: s.stroke_width! / 2,
    y: s.spacing! + s.stroke_width! / 2,
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

  const update = ({ width, dx }: PostRenderUpdateContext) => {
    $rect.setAttribute('width', String(width - s.stroke_width!))
    $title.setAttribute('width', String(width))
    translate($group, -dx, 0)
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
