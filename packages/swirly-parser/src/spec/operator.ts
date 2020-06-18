import { OperatorSpecification } from '@swirly/types'

export const toOperatorSpec = (title: string): OperatorSpecification => ({
  kind: 'O',
  title
})
