import { ObservableStyle } from '../observable-style'

export function getObservableSlopeAngle (
  { distanceX, nestedShift }: ObservableStyle,
  level: number
): number {
  return Math.atan((nestedShift * level) / distanceX)
}
