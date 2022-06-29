import { CompletionMessageStyles, MessageSpecification } from '@swirly/types'

import { RendererContext, RendererResult } from '../types.js'
import { mergeStyles } from '../util/merge-styles.js'
import { NotificationKind } from '../util/notification-kind.js'
import { createSvgElement } from '../util/svg-xml.js'
import { translate } from '../util/transform.js'

const supports = ({ notification: { kind } }: MessageSpecification) =>
  NotificationKind.COMPLETE.equals(kind)

const render = (
  { document, styles, streamHeight }: RendererContext,
  message: MessageSpecification
): RendererResult => {
  const s: CompletionMessageStyles = mergeStyles(
    styles,
    message.styles,
    'completion_'
  )

  const x = message.frame * styles.frame_width! - s.stroke_width! / 2
  const y1 = (streamHeight - s.height!) / 2
  const y2 = y1 + s.height!

  const $group = createSvgElement(document, 'g')
  translate($group, x, 0)

  $group.appendChild(
    createSvgElement(document, 'line', {
      x1: 0,
      y1,
      x2: 0,
      y2,
      stroke: s.stroke_color!,
      'stroke-width': s.stroke_width!
    })
  )

  const bbox = {
    x1: x - s.stroke_width! / 2,
    y1,
    x2: x + s.stroke_width! / 2,
    y2
  }

  return {
    element: $group,
    bbox
  }
}

export const completeMessageRenderer = { supports, render }
