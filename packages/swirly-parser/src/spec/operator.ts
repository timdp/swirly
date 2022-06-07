import { OperatorSpecification, OperatorTitleSegment } from '@swirly/types'

export const createOperatorSpecification = (
  title: OperatorTitleSegment[]
): OperatorSpecification => ({
  kind: 'O',
  title
})
