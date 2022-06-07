import { OperatorTitleSegment } from '@swirly/types'

import { OPERATOR_PREFIX } from '../constants'
import { createOperatorSpecification } from '../spec/operator'
import { Parser, ParserContext } from '../types'

const reInnerStream = /`(.+?)`/g

const match = (line: string): boolean => line.startsWith(OPERATOR_PREFIX)

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

const run = (lines: readonly string[], { content }: ParserContext) => {
  const titleStr = lines[0].substring(OPERATOR_PREFIX.length).trim()
  const titleSegments = parseTitle(titleStr)
  const spec = createOperatorSpecification(titleSegments)
  content.push(spec)
}

export const operatorParser: Parser = {
  match,
  run
}
