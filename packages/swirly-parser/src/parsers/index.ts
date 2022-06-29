import { Parser } from '../types.js'
import { diagramStylesParser } from './diagram-styles.js'
import { messageStylesParser } from './message-styles.js'
import { operatorParser } from './operator.js'
import { streamParser } from './stream.js'

export const parsers: readonly Parser[] = [
  diagramStylesParser,
  messageStylesParser,
  operatorParser,
  streamParser
]
