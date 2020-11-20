import { DiagramContent, DiagramStyles } from '@swirly/types'

export type ParserContext = {
  content: DiagramContent
  styles: DiagramStyles
  allValues: { [key: string]: any }
}

export type Parser = {
  match: (line: string) => boolean
  run: (lines: readonly string[], ctx: ParserContext) => void
}
