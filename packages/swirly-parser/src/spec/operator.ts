import { OperatorSpecification } from '@swirly/types'

export const createOperatorSpecification = (
  title: string
): OperatorSpecification => ({
  kind: 'O',
  title
})
