import { TestMessage } from '@swirly/parser-rxjs'
import {
  DiagramContent,
  DiagramStyles,
  ScalarNextMessageStyles
} from '@swirly/types'

export type ParserContext = {
  content: DiagramContent
  diagramStyles: DiagramStyles
  messageStyles: Record<string, ScalarNextMessageStyles>
  allValues: Record<string, TestMessage[]>
}

export type Parser = {
  match: (line: string) => boolean
  run: (lines: readonly string[], ctx: ParserContext) => void
}
