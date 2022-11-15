import { StreamSpecification } from '@swirly/types'

import { DiagramContext } from '../diagram-context'

export function getTitleWidth (
  { style: { titleFontSize }, font }: DiagramContext,
  { title }: StreamSpecification
): number | null {
  if (title === null) {
    return null
  }

  return Math.ceil(font.getAdvanceWidth(title, titleFontSize))
}
