import { Parser } from '../types'
import { operatorParser } from './operator'
import { streamParser } from './stream'
import { stylesParser } from './styles'

export const parsers: readonly Parser[] = [
  stylesParser,
  operatorParser,
  streamParser
]
