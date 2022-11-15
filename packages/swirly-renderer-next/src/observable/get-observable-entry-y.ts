import { ObservableStyle } from '../observable-style'

export function getObservableEntryY (
  { distanceY, distanceX, nestedShift }: ObservableStyle,
  level: number,
  frame: number,
  floor: number,
  offsetX: number
): number {
  return distanceY * floor + nestedShift * level * (frame + offsetX / distanceX)
}
