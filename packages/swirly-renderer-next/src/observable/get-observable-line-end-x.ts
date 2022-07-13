import { StreamSpecification } from '@swirly/types'

import { ObservableStyle } from '../observable-style'
import { getObservableEntryX } from './get-observable-entry-x'

export function getObservableLineEndX (
  style: ObservableStyle,
  level: number,
  observable: StreamSpecification
) {
  return getObservableEntryX(
    style,
    level,
    observable,
    observable.duration + 1,
    style.notificationRadius
  )
}
