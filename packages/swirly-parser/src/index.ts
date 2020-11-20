import { DiagramSpecification } from '@swirly/types'

import { parsers } from './parsers'
import { createDiagramSpecification } from './spec/diagram'
import { createOperatorSpecification } from './spec/operator'
import { createStreamSpecification } from './spec/stream'
import { ParserContext } from './types'
import { byBlock } from './util/by-block'

const parseMarbleDiagramSpecification = (str: string): DiagramSpecification => {
  const ctx: ParserContext = { content: [], styles: {}, allValues: {} }

  for (const lines of byBlock(str)) {
    const parser = parsers.find(parser => parser.match(lines[0]))!
    parser.run(lines, ctx)
  }

  return createDiagramSpecification(ctx.content, ctx.styles)
}

export {
  createDiagramSpecification,
  createOperatorSpecification,
  createStreamSpecification,
  parseMarbleDiagramSpecification
}
