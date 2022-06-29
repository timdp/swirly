import { DecorationSpecification } from '@swirly/types'

import {
  DecorationRenderer,
  DecorationRendererContext,
  DecorationRendererResult
} from '../types.js'
import { renderBarrierDecoration } from './barrier.js'
import { renderRangeDecoration } from './range.js'

const strategies: Record<string, DecorationRenderer> = {
  barrier: renderBarrierDecoration,
  range: renderRangeDecoration
}

export const renderDecoration = (
  ctx: DecorationRendererContext,
  decoration: DecorationSpecification
): DecorationRendererResult => {
  const render: DecorationRenderer = strategies[decoration.kind]
  return render(ctx, decoration)
}
