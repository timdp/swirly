import {
  DiagramContent,
  DiagramSpecification,
  DiagramStyles
} from '@swirly/types'

export const createDiagramSpecification = (
  content: DiagramContent,
  styles: DiagramStyles
): DiagramSpecification => ({
  content,
  styles
})
