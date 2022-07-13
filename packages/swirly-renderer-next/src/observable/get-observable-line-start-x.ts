import { StreamSpecification } from '@swirly/types'

import { ObservableStyle } from '../observable-style'
import { getObservableEntryX } from './get-observable-entry-x'

export function getObservableLineStartX (
  style: ObservableStyle,
  level: number,
  observable: StreamSpecification
) {
  return getObservableEntryX(
    style,
    level,
    observable,
    0,
    level === 0 ? -style.notificationRadius : 0
  )
}
