import { StreamSpecification } from '@swirly/types'

import { getObservableEntries } from '../get-observable-entries'
import { isNextNotification } from '../next/is-next-notification'
import { isObservableNextNotification } from '../next/is-observable-next-notification'
import { ObservableStyle } from '../observable-style'
import { maxIterable } from '../util/maxIterable'
import { getObservableEntryX } from './get-observable-entry-x'
import { getObservableLineEndX } from './get-observable-line-end-x'
import { getObservableLineStartX } from './get-observable-line-start-x'

function * getSubWidth (
  style: ObservableStyle,
  level: number,
  x: number,
  observable: StreamSpecification
): Iterable<number> {
  // line
  yield x + getObservableLineStartX(style, level, observable)
  yield x + getObservableLineEndX(style, level, observable)

  // eslint-disable-next-line no-unused-vars
  for (const [frame, _floor, notification] of getObservableEntries(
    observable
  )) {
    if (
      !isNextNotification(notification) ||
      !isObservableNextNotification(notification)
    ) {
      continue
    }

    yield * getSubWidth(
      style,
      level,
      x + getObservableEntryX(style, level + 1, observable, frame, 0),
      notification.value
    )
  }
}

export function getObservableWidth (
  style: ObservableStyle,
  observable: StreamSpecification
) {
  return maxIterable(getSubWidth(style, 0, 0, observable))
}
