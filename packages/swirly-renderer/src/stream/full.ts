import { StreamSpecification, StreamStyles } from '@swirly/types'

import { RendererContext, RendererResult } from '../types.js'
import { mergeStyles } from '../util/merge-styles.js'
import { createSvgElement } from '../util/svg-xml.js'
import { translate } from '../util/transform.js'
import { renderStreamBase } from './core.js'

export const renderStream = (
  ctx: RendererContext,
  stream: StreamSpecification
): RendererResult => {
  const { document, styles, streamHeight, streamTitleEnabled } = ctx
  const s: StreamStyles = mergeStyles(styles, stream.styles, 'stream_')

  const renderStreamResult = renderStreamBase(ctx, stream, false, false)

  const { element: $streamGroup, bbox } = renderStreamResult

  if (stream.frame != null && stream.frame > 0) {
    const dx = stream.frame * styles.frame_width!
    translate($streamGroup, dx, 0)
    bbox.x1 += dx
    bbox.x2 += dx
  }

  if (!streamTitleEnabled) {
    return renderStreamResult
  }

  const $outerGroup = createSvgElement(document, 'g')

  const title = typeof stream.title === 'string' ? stream.title : ''
  $outerGroup.appendChild(
    createSvgElement(
      document,
      'text',
      {
        x: 0,
        y: streamHeight / 2,
        fill: s.title_color!,
        'font-family': s.title_font_family!,
        'font-size': s.title_font_size! + 'px',
        'font-weight': s.title_font_weight!,
        'font-style': s.title_font_style!,
        'dominant-baseline': 'middle'
      },
      title
    )
  )

  $outerGroup.appendChild($streamGroup)
  translate($streamGroup, s.title_width!, 0)

  bbox.x1 = 0
  bbox.x2 += s.title_width!

  return {
    element: $outerGroup,
    bbox
  }
}
