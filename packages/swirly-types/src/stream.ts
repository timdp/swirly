import { DecorationSpecification } from './decoration.js'
import { MessageSpecification } from './message.js'
import { StreamStyles } from './styles.js'

export type StreamSpecification = {
  kind: 'S'
  title: string | null
  frame?: number
  duration: number
  messages: MessageSpecification[]
  styles?: StreamStyles | null
  decorations?: DecorationSpecification[] | null
}
