import { Parser, ParserContext } from '../types'
import { parseConfig } from './config'

const reHeader = /^\[styles\.(.)\]$/

const match = (line: string): boolean => reHeader.test(line)

const run = (lines: readonly string[], ctx: ParserContext) => {
  const [headerLine, ...configLines] = lines
  const [, message] = reHeader.exec(headerLine)!
  ctx.messageStyles[message] = parseConfig(configLines, false)
}

export const messageStylesParser: Parser = {
  match,
  run
}
