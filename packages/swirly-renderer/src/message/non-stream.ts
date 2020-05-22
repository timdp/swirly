import { MessageSpecification } from 'swirly-types'

import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types'
import { completeMessageRenderer } from './complete'
import { errorMessageRenderer } from './error'
import { scalarMessageRenderer } from './scalar'

const strategies = [
  completeMessageRenderer,
  errorMessageRenderer,
  scalarMessageRenderer
]

const supports = ({ notification }: MessageSpecification) =>
  !('value' in notification) || typeof notification.value !== 'object'

const render = (
  ctx: RendererContext,
  message: MessageSpecification,
  options: MessageRendererOptions
): RendererResult => {
  const renderer = strategies.find(renderer => renderer.supports(message))!
  return renderer.render(ctx, message, options)
}

export const nonStreamMessageRenderer = { supports, render }
