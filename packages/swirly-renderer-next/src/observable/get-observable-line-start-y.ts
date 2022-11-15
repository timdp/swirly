import { ObservableStyle } from '../observable-style'
import { getObservableEntryY } from './get-observable-entry-y'

export function getObservableLineStartY (style: ObservableStyle, level: number) {
  return getObservableEntryY(
    style,
    level,
    0,
    0,
    level === 0 ? -style.notificationRadius : 0
  )
}
