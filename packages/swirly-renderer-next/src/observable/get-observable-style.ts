import { DiagramContext } from '../diagram-context'
import { ObservableStyle } from '../observable-style'

export function getObservableStyle ({ style }: DiagramContext): ObservableStyle {
  return {
    notificationRadius: style.observableNotificationRadius,
    fontSize: style.observableFontSize,
    distanceX: style.observableDistanceX,
    distanceY: style.observableDistanceY,
    nestedShift: style.observableNestedShift
  }
}
