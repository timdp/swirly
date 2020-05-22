import { MessageSpecification } from 'swirly-types'

import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types'
import { nonStreamMessageRenderer } from './non-stream'
import { streamMessageRenderer } from './stream'

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
