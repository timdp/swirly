import { DiagramSpecification } from '@swirly/types'

import { parsers } from './parsers'
import { ParserContext } from './types'
import { byBlock } from './util/by-block'

export const parseMarbleDiagramSpec = (str: string): DiagramSpecification => {
  const ctx: ParserContext = { content: [], styles: {}, allValues: {} }

  for (const lines of byBlock(str)) {
    const parser = parsers.find(parser => parser.match(lines[0]))!
    parser.run(lines, ctx)
  }

  return ctx
}
