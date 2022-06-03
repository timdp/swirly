import { streamParser } from '@swirly/parser'
import {
  Color,
  DiagramContent,
  OperatorSpecification,
  OperatorStyles,
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

type Token = {
  type: 'text' | 'observable'
  value: string
}

const NON_BREAKING_SPACE = '\xA0'

const reInnerObservable = /`(.+?)`/g
const reSpace = / /g

const parseTitle = (text: string): Token[] => {
  const tokens: Token[] = []
  let index = 0
  let match
  while ((match = reInnerObservable.exec(text)) != null) {
    if (index !== match.index) {
      tokens.push({
        type: 'text',
        value: text.substring(index, match.index)
      })
    }
    tokens.push({
      type: 'observable',
      value: match[1]
    })
    index = match.index + match[0].length
  }
  tokens.push({
    type: 'text',
    value: text.substring(index)
  })
  return tokens
}

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

const tokenRenderers = {
  text: (value: string, ctx: RendererContext) => {
    const $div = ctx.document.createElement('div')
    $div.textContent = value.replace(reSpace, NON_BREAKING_SPACE)
    return $div
  },
  observable: (value: string, ctx: RendererContext, styles: OperatorStyles) => {
    const content: DiagramContent = []
    streamParser.run([value], { content, styles: {}, allValues: {} })
    const [spec] = content as StreamSpecification[]
    const {
      element: $group,
      bbox: { x2: width, y2: height }
    } = renderStreamBase(ctx, spec, false, false)
    const { documentElement: $svg } = createSvgDocument(ctx.DOMParser)
    setSvgDimensions($svg, width, height, (styles.stream_scale ?? 100) / 100)
    $svg.appendChild($group)
    return $svg
  }
}

const renderRichTitle = (
  tokens: Token[],
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
  for (const token of tokens) {
    const $element = tokenRenderers[token.type](token.value, ctx, styles)
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
  text: string,
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

  const tokens = parseTitle(text)
  const isText = tokens.length === 1 && tokens[0].type === 'text'

  const $title = isText
    ? renderTextTitle(text, ctx, color, styles, fontStyles)
    : renderRichTitle(tokens, ctx, color, styles, fontStyles)

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
