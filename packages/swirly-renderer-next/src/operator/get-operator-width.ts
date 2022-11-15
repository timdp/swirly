import { OperatorSpecification } from '@swirly/types'

import { DiagramContext } from '../diagram-context'
import { getObservableWidth } from '../observable/get-observable-width'
import { getOperatorTextWidth } from '../operator-text/get-operator-text-width'
import { getOperatorObservableStyle } from './get-operator-observable-style'

export function getOperatorWidth (
  context: DiagramContext,
  { title }: OperatorSpecification
) {
  const { operatorPadding } = context.style

  return title.reduce<number>(
    (previous, { type, value }) =>
      previous +
      (type === 'text'
        ? getOperatorTextWidth(context, value)
        : getObservableWidth(getOperatorObservableStyle(context), value)),
    operatorPadding * 2
  )
}
