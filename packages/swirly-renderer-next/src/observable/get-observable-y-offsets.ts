import { StreamSpecification } from '@swirly/types'

import { getObservableEntries } from '../get-observable-entries'
import { isNextNotification } from '../next/is-next-notification'
import { isObservableNextNotification } from '../next/is-observable-next-notification'
import { ObservableStyle } from '../observable-style'
import { getObservableEntryY } from './get-observable-entry-y'
import { getObservableLineEndY } from './get-observable-line-end-y'
import { getObservableLineStartY } from './get-observable-line-start-y'

export function * getObservableYOffsets (
  style: ObservableStyle,
  y: number,
  level: number,
  observable: StreamSpecification
): Iterable<number> {
  // line
  yield Math.ceil(y + getObservableLineStartY(style, level))
  yield Math.ceil(y + getObservableLineEndY(style, level, observable))

  for (const [frame, floor, notification] of getObservableEntries(observable)) {
    const subY = y + getObservableEntryY(style, level, frame, floor, 0)

    if (
      isNextNotification(notification) &&
      isObservableNextNotification(notification)
    ) {
      yield * getObservableYOffsets(style, subY, level + 1, notification.value)
    } else {
      yield subY - style.notificationRadius
      yield subY + style.notificationRadius
    }
  }
}
