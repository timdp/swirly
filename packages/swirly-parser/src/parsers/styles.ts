import { STYLES_HEADER } from '../constants'
import { Parser, ParserContext } from '../types'
import { parseConfig } from './config'

const match = (line: string): boolean => line === STYLES_HEADER

const run = (lines: string[], { styles }: ParserContext) => {
  const extraStyles = parseConfig(lines.slice(1), false)
  Object.assign(styles, extraStyles)
}

export const stylesParser: Parser = {
  match,
  run
}
