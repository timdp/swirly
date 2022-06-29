import {
  MessageSpecification,
  ScalarNextMessageStyles,
  ScalarNextNotificationSpecification
} from '@swirly/types'

import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types.js'
import { mergeStyles } from '../util/merge-styles.js'
import { stringToColor } from '../util/string-to-color.js'
import { createSvgElement } from '../util/svg-xml.js'
import { rotate, translate } from '../util/transform.js'

const COLOR_TO_MODE: Record<string, 'light' | 'dark'> = {
  auto: 'light',
  auto_light: 'light',
  auto_dark: 'dark'
}

const supports = () => true

const render = (
  { document, styles, streamHeight }: RendererContext,
  message: MessageSpecification,
  { valueAngle }: MessageRendererOptions
): RendererResult => {
  const s: ScalarNextMessageStyles = mergeStyles(
    styles,
    message.styles,
    'event_'
  )
  const { value } = message.notification as ScalarNextNotificationSpecification

  const x = message.frame * styles.frame_width! - styles.event_radius!

  const $group = createSvgElement(document, 'g')
  translate($group, x, 0)

  const fillColorMode = COLOR_TO_MODE[s.fill_color!]
  const finalFillColor =
    fillColorMode != null ? stringToColor(value, fillColorMode) : s.fill_color!

  $group.appendChild(
    createSvgElement(document, 'ellipse', {
      cx: styles.event_radius,
      cy: streamHeight / 2,
      rx: styles.event_radius! - s.stroke_width! / 2,
      ry: styles.event_radius! - s.stroke_width! / 2,
      fill: finalFillColor,
      stroke: s.stroke_color!,
      'stroke-width': s.stroke_width!
    })
  )

  const $label = createSvgElement(
    document,
    'text',
    {
      x: 0,
      y: 0,
      fill: s.value_color!,
      'font-family': s.value_font_family!,
      'font-size': s.value_font_size! + 'px',
      'font-weight': s.value_font_weight!,
      'font-style': s.value_font_style!,
      'dominant-baseline': 'middle',
      'text-anchor': 'middle'
    },
    value
  )
  translate($label, styles.event_radius!, streamHeight / 2)
  rotate($label, valueAngle, 0, 0)
  $group.appendChild($label)

  const bbox = {
    x1: x,
    y1: 0,
    x2: x + styles.event_radius! * 2,
    y2: streamHeight
  }

  return {
    element: $group,
    bbox
  }
}

export const scalarMessageRenderer = {
  supports,
  render
}
