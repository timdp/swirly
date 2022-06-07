import { Parser } from '../types'
import { diagramStylesParser } from './diagram-styles'
import { messageStylesParser } from './message-styles'
import { operatorParser } from './operator'
import { streamParser } from './stream'

export const parsers: readonly Parser[] = [
  diagramStylesParser,
  messageStylesParser,
  operatorParser,
  streamParser
]
