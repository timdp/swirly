import { OperatorStyles } from './styles'

export type OperatorTitleSegment = {
  type: 'text' | 'stream'
  value: string
}

export type OperatorSpecification = {
  kind: 'O'
  title: OperatorTitleSegment[]
  styles?: OperatorStyles
}
