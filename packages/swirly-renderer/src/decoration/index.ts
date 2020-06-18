import { DecorationSpecification } from '@swirly/types'

import {
  DecorationRenderer,
  DecorationRendererContext,
  DecorationRendererResult
} from '../types'
import { renderBarrierDecoration } from './barrier'
import { renderRangeDecoration } from './range'

const strategies: { [key: string]: DecorationRenderer } = {
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
