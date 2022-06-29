import { OperatorTitleSegment } from '@swirly/types'

import { createOperatorSpecification } from '../spec/operator.js'
import { Parser, ParserContext } from '../types.js'

const reInnerStream = /`(.+?)`/g

const match = (line: string): boolean => line.startsWith('>')

const parseTitle = (text: string): OperatorTitleSegment[] => {
  const segments: OperatorTitleSegment[] = []
  let index = 0
  let match
  while ((match = reInnerStream.exec(text)) != null) {
    if (index !== match.index) {
      segments.push({
        type: 'text',
        value: text.substring(index, match.index)
      })
    }
    segments.push({
      type: 'stream',
      value: match[1]
    })
    index = match.index + match[0].length
  }
  segments.push({
    type: 'text',
    value: text.substring(index)
  })
  return segments
}

const run = (lines: readonly string[], ctx: ParserContext) => {
  const titleStr = lines[0].substring(1).trim()
  const titleSegments = parseTitle(titleStr)
  const spec = createOperatorSpecification(titleSegments)
  ctx.content.push(spec)
}

export const operatorParser: Parser = {
  match,
  run
}
