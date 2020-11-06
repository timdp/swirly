import { DiagramContent, DiagramStyles } from '@swirly/types'

export type Parser = {
  match: (line: string) => boolean
  run: (lines: readonly string[], ctx: ParserContext) => void
}

export type ParserContext = {
  content: DiagramContent
  styles: DiagramStyles
  allValues: { [key: string]: any }
}
