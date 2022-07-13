import { StreamSpecification } from '@swirly/types'

import { ObservableStyle } from '../observable-style'
import { getObservableEntryY } from './get-observable-entry-y'

export function getObservableLineEndY (
  style: ObservableStyle,
  level: number,
  observable: StreamSpecification
) {
  return getObservableEntryY(
    style,
    level,
    observable.duration + 1,
    0,
    style.notificationRadius
  )
}
