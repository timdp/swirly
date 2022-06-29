import { OperatorStyles } from './styles.js'

export type OperatorTitleSegment = {
  type: 'text' | 'stream'
  value: string
}

export type OperatorSpecification = {
  kind: 'O'
  title: OperatorTitleSegment[]
  styles?: OperatorStyles
}
