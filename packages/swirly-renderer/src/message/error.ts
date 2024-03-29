import { ErrorMessageStyles, MessageSpecification } from '@swirly/types'

import { RendererContext, RendererResult } from '../types.js'
import { mergeStyles } from '../util/merge-styles.js'
import { NotificationKind } from '../util/notification-kind.js'
import { createSvgElement } from '../util/svg-xml.js'
import { translate } from '../util/transform.js'

const supports = ({ notification: { kind } }: MessageSpecification) =>
  NotificationKind.ERROR.equals(kind)

const render = (
  { document, styles, streamHeight }: RendererContext,
  message: MessageSpecification
): RendererResult => {
  const s: ErrorMessageStyles = mergeStyles(styles, message.styles, 'error_')

  const x = message.frame * styles.frame_width! - s.size! / 2
  const y = (streamHeight - s.size!) / 2

  const $group = createSvgElement(document, 'g')
  translate($group, x, y)

  $group.appendChild(
    createSvgElement(document, 'line', {
      x1: 0,
      y1: 0,
      x2: s.size!,
      y2: s.size!,
      stroke: s.color!,
      'stroke-width': s.stroke_width!
    })
  )

  $group.appendChild(
    createSvgElement(document, 'line', {
      x1: s.size!,
      y1: 0,
      x2: 0,
      y2: s.size!,
      stroke: s.color!,
      'stroke-width': s.stroke_width!
    })
  )

  const bbox = {
    x1: x,
    y1: y,
    x2: x + s.size!,
    y2: y + s.size!
  }

  return {
    element: $group,
    bbox
  }
}

export const errorMessageRenderer = { supports, render }
