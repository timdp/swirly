import { CompletionMessageStyles, MessageSpecification } from 'swirly-types'

import { RendererContext, RendererResult } from '../types'
import { createElement } from '../util/create-element'
import { mergeStyles } from '../util/merge-styles'
import { NotificationKind } from '../util/notification-kind'
import { translate } from '../util/transform'

const supports = ({ notification: { kind } }: MessageSpecification) =>
  NotificationKind.COMPLETE.equals(kind)

const render = (
  { document, styles, streamHeight, nextIndex }: RendererContext,
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

  const $group = createElement(document, 'g', {
    role: 'listitem',
    'aria-label': 'Completion',
    tabindex: nextIndex()
  })
  translate($group, x, 0)

  $group.appendChild(
    createElement(document, 'line', {
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
