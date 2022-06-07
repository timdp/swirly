import { Parser, ParserContext } from '../types'
import { parseConfig } from './config'

const match = (line: string): boolean => line === '[styles]'

const run = (lines: readonly string[], ctx: ParserContext) => {
  const extraStyles = parseConfig(lines.slice(1), false)
  Object.assign(ctx.diagramStyles, extraStyles)
}

export const diagramStylesParser: Parser = {
  match,
  run
}
