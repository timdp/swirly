import { BarrierDecorationStyles, RangeDecorationStyles } from './styles.js'

export type BarrierDecorationSpecification = {
  kind: 'barrier'
  frame: number
  styles?: BarrierDecorationStyles
}

export type RangeDecorationSpecification = {
  kind: 'range'
  frame: number
  duration: number
  styles?: RangeDecorationStyles
}

export type DecorationSpecification =
  | BarrierDecorationSpecification
  | RangeDecorationSpecification
