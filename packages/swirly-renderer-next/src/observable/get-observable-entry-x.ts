import { StreamSpecification } from '@swirly/types'

import { ObservableStyle } from '../observable-style'

export function getObservableEntryX (
  { distanceX, notificationRadius }: ObservableStyle,
  level: number,
  observable: StreamSpecification,
  frame: number,
  offsetX: number
): number {
  return (
    (level === 0 ? notificationRadius : 0) +
    distanceX * ((observable.frame ?? 0) + frame) +
    offsetX
  )
}
