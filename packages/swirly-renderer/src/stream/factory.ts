import {
  ArrowStyles,
  MessageSpecification,
  StreamSpecification
} from '@swirly/types'

import { renderArrow } from '../arrow.js'
import { renderDecoration } from '../decoration/index.js'
import {
  MessageRenderer,
  Rectangle,
  RendererContext,
  RendererResult,
  TimeScaler
} from '../types.js'
import { degreesToRadians } from '../util/degrees-to-radians.js'
import { rectangleUnion } from '../util/geometry.js'
import { mergeStyles } from '../util/merge-styles.js'
import { NotificationKind } from '../util/notification-kind.js'
import { createSvgElement } from '../util/svg-xml.js'
import { translate } from '../util/transform.js'

const nullScaleTime: TimeScaler = (time) => time

const createScaleTime = (higherOrderAngleDegrees: number): TimeScaler => {
  const scale = 1 / Math.cos(degreesToRadians(higherOrderAngleDegrees))
  return (time) => time * scale
}

const isNotification = ({
  notification: { kind }
}: MessageSpecification): boolean => NotificationKind.NEXT.equals(kind)

const countPriors = (
  message: MessageSpecification,
  index: number,
  messages: readonly MessageSpecification[]
): number => {
  let count = 0
  for (let i = 0; i < index; ++i) {
    if (isNotification(messages[i]) && messages[i].frame === message.frame) {
      ++count
    }
  }
  return count
}

export const createRenderStream =
  (renderMessage: MessageRenderer) =>
    (
      ctx: RendererContext,
      stream: StreamSpecification,
      isHigherOrder: boolean,
      isGhost: boolean
    ): RendererResult => {
      const { document, styles } = ctx

      const scaleTime = isHigherOrder
        ? createScaleTime(styles.higher_order_angle!)
        : nullScaleTime

      const $group = createSvgElement(
        document,
        'g',
        isGhost
          ? {
              style: `filter: opacity(${styles.ghost_opacity}%)`
            }
          : undefined
      )
      const bboxes: Rectangle[] = []

      const add = ({ element, bbox }: RendererResult) => {
        $group.appendChild(element)
        bboxes.push(bbox)
      }

      const arrowStyles: ArrowStyles = mergeStyles(
        styles,
        stream.styles,
        'arrow_',
        true
      )
      const scaledDuration = scaleTime(stream.duration)
      add(renderArrow(ctx, arrowStyles, styles.arrowhead_angle!, scaledDuration))

      for (let i = stream.messages.length - 1; i >= 0; --i) {
        const message = stream.messages[i]
        const scaledMessage = {
          ...message,
          frame: scaleTime(message.frame)
        }

        const priorCount = isNotification(message)
          ? countPriors(message, i, stream.messages)
          : 0
        const dy = priorCount * styles.stacking_height!

        const valueAngle = isHigherOrder
          ? styles.higher_order_event_value_angle!
          : 0

        const options = {
          verticalOffset: dy,
          valueAngle
        }

        const { element, bbox } = renderMessage(ctx, scaledMessage, options)

        translate(element, 0, dy)
        bbox.y2 += dy

        add({ element, bbox })
      }

      const innerCtx = {
        ...ctx,
        scaleTime,
        bbox: rectangleUnion(bboxes)
      }

      if (stream.decorations != null) {
        for (const decoration of stream.decorations) {
          const { element, bbox } = renderDecoration(innerCtx, decoration)
          $group.appendChild(element)
          if (bbox != null) {
            innerCtx.bbox = rectangleUnion([innerCtx.bbox, bbox])
          }
        }
      }

      return {
        element: $group,
        bbox: innerCtx.bbox
      }
    }
