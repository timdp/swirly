import { DiagramSpecification } from '@swirly/types'

import { parsers } from './parsers/index.js'
import { createDiagramSpecification } from './spec/diagram.js'
import { createOperatorSpecification } from './spec/operator.js'
import { createStreamSpecification } from './spec/stream.js'
import { ParserContext } from './types.js'
import { byBlock } from './util/by-block.js'

const parseMarbleDiagramSpecification = (str: string): DiagramSpecification => {
  const ctx: ParserContext = {
    content: [],
    diagramStyles: {},
    messageStyles: {},
    allValues: {}
  }

  for (const lines of byBlock(str)) {
    const parser = parsers.find((parser) => parser.match(lines[0]))!
    parser.run(lines, ctx)
  }

  return createDiagramSpecification(ctx.content, ctx.diagramStyles)
}

export {
  createDiagramSpecification,
  createOperatorSpecification,
  createStreamSpecification,
  parseMarbleDiagramSpecification
}
