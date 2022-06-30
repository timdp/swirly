import { StreamSpecification } from './stream.js'
import { OperatorStyles } from './styles.js'

export type TextOperatorTitleSegment = {
  type: 'text'
  value: string
}

export type StreamOperatorTitleSegment = {
  type: 'stream'
  value: StreamSpecification
}

export type OperatorTitleSegment =
  | TextOperatorTitleSegment
  | StreamOperatorTitleSegment

export type OperatorSpecification = {
  kind: 'O'
  title: OperatorTitleSegment[]
  styles?: OperatorStyles
}
