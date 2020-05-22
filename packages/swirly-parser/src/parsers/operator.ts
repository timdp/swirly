import { OPERATOR_PREFIX } from '../constants'
import { toOperatorSpec } from '../spec/operator'
import { Parser, ParserContext } from '../types'

const match = (line: string): boolean => line.startsWith(OPERATOR_PREFIX)

const run = (lines: string[], { content }: ParserContext) => {
  const title = lines[0].substring(OPERATOR_PREFIX.length).trim()
  const spec = toOperatorSpec(title)
  content.push(spec)
}

export const operatorParser: Parser = {
  match,
  run
}
