import {
  MessageSpecification,
  StreamNextNotificationSpecification
} from '@swirly/types'

import { createRenderStream } from '../stream/factory.js'
import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types.js'
import { degreesToRadians } from '../util/degrees-to-radians.js'
import { rotateRectangle, translateRectangle } from '../util/geometry.js'
import { rotate, translate } from '../util/transform.js'
import { nonStreamMessageRenderer } from './non-stream.js'

const supports = (message: MessageSpecification) =>
  !nonStreamMessageRenderer.supports(message)

const renderStreamImpl = createRenderStream(nonStreamMessageRenderer.render)

const render = (
  ctx: RendererContext,
  { frame, notification }: MessageSpecification,
  { verticalOffset }: MessageRendererOptions
): RendererResult => {
  const { styles, streamHeight } = ctx
  const { value, isGhost } = notification as StreamNextNotificationSpecification

  const x = frame * styles.frame_width!
  const y = streamHeight / 2 + verticalOffset

  const { element: $group, bbox } = renderStreamImpl(ctx, value, true, isGhost)

  rotate($group, styles.higher_order_angle!, x, y)
  translate($group, x, 0)

  const rotatedBBox = rotateRectangle(
    bbox,
    degreesToRadians(styles.higher_order_angle!),
    0,
    y
  )
  const translatedBBox = translateRectangle(rotatedBBox, x, 0)

  return {
    element: $group,
    bbox: translatedBBox
  }
}

export const streamMessageRenderer = {
  supports,
  render
}
