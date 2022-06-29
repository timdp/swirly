import { MessageSpecification } from '@swirly/types'

import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types.js'
import { completeMessageRenderer } from './complete.js'
import { errorMessageRenderer } from './error.js'
import { scalarMessageRenderer } from './scalar.js'

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
  const renderer = strategies.find((renderer) => renderer.supports(message))!
  return renderer.render(ctx, message, options)
}

export const nonStreamMessageRenderer = { supports, render }
