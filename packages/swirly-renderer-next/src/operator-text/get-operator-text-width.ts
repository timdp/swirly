import { DiagramContext } from '../diagram-context'

export function getOperatorTextWidth (
  { style: { operatorFontSize }, font }: DiagramContext,
  value: string
): number {
  return Math.ceil(font.getAdvanceWidth(value, operatorFontSize))
}
