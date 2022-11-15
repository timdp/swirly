import { OperatorSpecification } from '@swirly/types'

import { DiagramContext } from '../diagram-context'
import { getObservableYOffsets } from '../observable/get-observable-y-offsets'
import { ObservableStyle } from '../observable-style'
import { mapIterable } from '../util/map-iterable'
import { getOperatorObservableStyle } from './get-operator-observable-style'

export function * getOperatorYOffsets (
  context: DiagramContext,
  { title }: OperatorSpecification
): Iterable<number> {
  const { operatorLightHeight, operatorPadding } = context.style
  const observableStyle: ObservableStyle = getOperatorObservableStyle(context)

  yield (operatorLightHeight + operatorPadding) / -2
  yield (operatorLightHeight + operatorPadding) / 2

  for (const segment of title) {
    if (segment.type === 'text') {
      continue
    }

    yield * mapIterable(
      getObservableYOffsets(observableStyle, 0, 0, segment.value),
      (value) => value + operatorPadding * Math.sign(value)
    )
  }
}
