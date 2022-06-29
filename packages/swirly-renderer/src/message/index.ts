import { MessageSpecification } from '@swirly/types'

import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types.js'
import { nonStreamMessageRenderer } from './non-stream.js'
import { streamMessageRenderer } from './stream.js'

export const renderMessage = (
  ctx: RendererContext,
  message: MessageSpecification,
  options: MessageRendererOptions
): RendererResult => {
  const renderer = streamMessageRenderer.supports(message)
    ? streamMessageRenderer
    : nonStreamMessageRenderer
  return renderer.render(ctx, message, options)
}
