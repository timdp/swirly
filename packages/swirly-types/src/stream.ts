import { DecorationSpecification } from './decoration'
import { MessageSpecification } from './message'
import { StreamStyles } from './styles'

export type StreamSpecification = {
  kind: 'S'
  title: string | null
  frame?: number
  duration: number
  messages: MessageSpecification[]
  styles?: StreamStyles | null
  decorations?: DecorationSpecification[] | null
}
