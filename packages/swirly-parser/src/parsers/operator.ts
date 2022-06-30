import {
  DiagramContent,
  OperatorTitleSegment,
  StreamSpecification
} from '@swirly/types'

import { createOperatorSpecification } from '../spec/operator.js'
import { Parser, ParserContext } from '../types.js'
import { parseConfig } from './config.js'
import { streamParser } from './stream.js'

const reInnerStream = /`(.+?)`/g

const match = (line: string): boolean => line.startsWith('>')

const parseInnerStream = (text: string, values: Record<string, any>) => {
  const content: DiagramContent = []
  streamParser.run([text], {
    content,
    diagramStyles: {},
    messageStyles: {},
    allValues: values
  })
  return content[0] as StreamSpecification
}

const parseTitle = (
  text: string,
  values: Record<string, any>
): OperatorTitleSegment[] => {
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
      value: parseInnerStream(match[1], values)
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
  const config = parseConfig(lines.slice(1), true)
  const titleStr = lines[0].substring(1).trim()
  const titleSegments = parseTitle(titleStr, config.values)
  const spec = createOperatorSpecification(titleSegments)
  ctx.content.push(spec)
}

export const operatorParser: Parser = {
  match,
  run
}
