import { DiagramSpecification } from 'swirly-types'

export type Parser = {
  match: (line: string) => boolean
  run: (lines: string[], ctx: ParserContext) => void
}

export type ParserContext = DiagramSpecification & {
  allValues: { [key: string]: any }
}
