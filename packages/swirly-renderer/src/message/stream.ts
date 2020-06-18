import {
  MessageSpecification,
  StreamNextNotificationSpecification
} from '@swirly/types'

import { createRenderStream } from '../stream-factory'
import {
  MessageRendererOptions,
  RendererContext,
  RendererResult
} from '../types'
import { degreesToRadians } from '../util/degrees-to-radians'
import { rotateRectangle, translateRectangle } from '../util/geometry'
import { rotate, translate } from '../util/transform'
import { nonStreamMessageRenderer } from './non-stream'

const supports = (message: MessageSpecification) =>
  !nonStreamMessageRenderer.supports(message)

const renderStreamImpl = createRenderStream(nonStreamMessageRenderer.render)

const render = (
  ctx: RendererContext,
  { frame, notification }: MessageSpecification,
  { verticalOffset }: MessageRendererOptions
): RendererResult => {
  const { styles, streamHeight } = ctx
  const { value } = notification as StreamNextNotificationSpecification

  const x = frame * styles.frame_width!
  const y = streamHeight / 2 + verticalOffset

  const { element: $group, bbox } = renderStreamImpl(ctx, true, value)

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
