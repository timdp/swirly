import { DiagramContext } from '../diagram-context'
import { ObservableStyle } from '../observable-style'

export function getOperatorObservableStyle ({
  style
}: DiagramContext): ObservableStyle {
  return {
    notificationRadius: style.operatorObservableNotificationRadius,
    fontSize: style.operatorObservableFontSize,
    distanceX: style.operatorObservableDistanceX,
    distanceY: style.operatorObservableDistanceY,
    nestedShift: style.observableNestedShift
  }
}
