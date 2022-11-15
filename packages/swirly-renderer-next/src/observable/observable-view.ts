import { StreamSpecification } from '@swirly/types'
import { Path } from 'opentype.js'

import { DiagramContext } from '../diagram-context'
import { isCompleteNotification } from '../is-complete-notification'
import { isErrorNotification } from '../is-error-notification'
import { isNextNotification } from '../next/is-next-notification'
import { isObservableNextNotification } from '../next/is-observable-next-notification'
import { nextView } from '../next/next-view'
import { ObservableStyle } from '../observable-style'
import { rotateX } from '../util/rotate-x'
import { rotateY } from '../util/rotate-y'
import { fragment } from '../xml/fragment'
import { tag } from '../xml/tag'
import { XmlNode } from '../xml/xml-node'
import { getObservableEntryX } from './get-observable-entry-x'
import { getObservableEntryY } from './get-observable-entry-y'
import { getObservableLineEndX } from './get-observable-line-end-x'
import { getObservableLineEndY } from './get-observable-line-end-y'
import { getObservableLineStartX } from './get-observable-line-start-x'
import { getObservableLineStartY } from './get-observable-line-start-y'
import { getObservableSlopeAngle } from './get-observable-slope-angle'

export function observableView (
  context: DiagramContext,
  style: ObservableStyle,
  x: number,
  y: number,
  level: number,
  observable: StreamSpecification
): XmlNode {
  const { styleCatcher } = context
  const { ghostOpacity, strokeColorLight, strokeWidth, strokeColorDark } =
    context.style
  const body: XmlNode[] = []
  const nextFloor = new Map<number, number>()

  for (const { frame, notification } of observable.messages) {
    if (!isNextNotification(notification)) {
      continue
    }

    let node: XmlNode
    const floor: number = nextFloor.get(frame) ?? 0

    nextFloor.set(frame, floor + 1)

    if (!isObservableNextNotification(notification)) {
      node = nextView(
        context,
        style,
        x + getObservableEntryX(style, level, observable, frame, 0),
        y + getObservableEntryY(style, level, frame, floor, 0),
        notification.value
      )
    } else {
      node = observableView(
        context,
        style,
        x + getObservableEntryX(style, level, observable, frame, 0),
        y + getObservableEntryY(style, level, frame, floor, 0),
        level + 1,
        notification.value
      )

      if (notification.isGhost) {
        node = tag(
          'g',
          { class: styleCatcher.attach({ opacity: ghostOpacity }, {}) },
          [node]
        )
      }
    }

    body.push(node)
  }

  const angle: number = getObservableSlopeAngle(style, level)

  const startX = x + getObservableLineStartX(style, level, observable)
  const startY = y + getObservableLineStartY(style, level)

  const endY = y + getObservableLineEndY(style, level, observable)
  const endX = x + getObservableLineEndX(style, level, observable)

  const d = new Path()

  d.moveTo(startX, startY)
  d.lineTo(endX, endY)

  const radius = style.notificationRadius

  d.moveTo(
    endX + rotateX(-radius, radius / -2, angle),
    endY + rotateY(-radius, radius / -2, angle)
  )
  d.lineTo(endX, endY)
  d.lineTo(
    endX + rotateX(-radius, radius / 2, angle),
    endY + rotateY(-radius, radius / 2, angle)
  )

  for (const { frame, notification } of observable.messages) {
    if (isNextNotification(notification)) {
      continue
    }

    const teardownX =
      x + getObservableEntryX(style, level, observable, frame, 0)
    const teardownY = y + getObservableEntryY(style, level, frame, 0, 0)
    const overlapped = nextFloor.has(frame)

    if (isCompleteNotification(notification)) {
      const offset: number = Math.ceil(
        overlapped ? radius * Math.SQRT2 : radius
      )

      d.moveTo(
        teardownX + rotateX(0, -offset, angle),
        teardownY + rotateY(0, -offset, angle)
      )
      d.lineTo(
        teardownX + rotateX(0, offset, angle),
        teardownY + rotateY(0, offset, angle)
      )
    } else if (isErrorNotification(notification)) {
      const offset: number = Math.ceil(
        overlapped ? radius : radius / Math.SQRT2
      )

      d.moveTo(
        teardownX + rotateX(-offset, -offset, angle),
        teardownY + rotateY(-offset, -offset, angle)
      )
      d.lineTo(
        teardownX + rotateX(offset, offset, angle),
        teardownY + rotateY(offset, offset, angle)
      )

      d.moveTo(
        teardownX + rotateX(offset, -offset, angle),
        teardownY + rotateY(offset, -offset, angle)
      )
      d.lineTo(
        teardownX + rotateX(-offset, offset, angle),
        teardownY + rotateY(-offset, offset, angle)
      )
    }
  }

  return fragment([
    tag('path', {
      class: styleCatcher.attach(
        {
          fill: 'none',
          stroke: strokeColorLight,
          strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
        { stroke: strokeColorDark }
      ),
      d: d.toPathData(1)
    }),
    fragment(body)
  ])
}
