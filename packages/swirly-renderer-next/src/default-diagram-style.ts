import { DiagramStyle } from './diagram-style'

export function defaultStyle ({
  padding = 25,
  rowGap = 20,
  bgColorLight = 'white',
  bgColorDark = 'black',
  textColorLight = 'black',
  textColorDark = 'white',

  titleFontSize = 18,
  titleMarginRight = 16,

  strokeWidth = 2,
  strokeColorLight = 'black',
  strokeColorDark = 'gray',
  ghostOpacity = 0.3,

  observableFontSize = 18,
  observableNotificationRadius = 18,
  observableDistanceX = 28,
  observableDistanceY = 28,
  observableNestedShift = 10,

  operatorFontSize = 24,
  operatorLightHeight = 32,
  operatorPadding = 15,
  operatorBgColorLight = 'white',
  operatorBgColorDark = 'black',
  operatorObservableFontSize = 16,
  operatorObservableNotificationRadius = 15,
  operatorObservableDistanceX = 22,
  operatorObservableDistanceY = 22,
  operatorObservableNestedShift = 8
}: Partial<DiagramStyle>): DiagramStyle {
  return {
    padding,
    rowGap,
    bgColorLight,
    bgColorDark,
    textColorLight,
    textColorDark,

    titleFontSize,
    titleMarginRight,

    strokeWidth,
    strokeColorLight,
    strokeColorDark,
    ghostOpacity,

    observableFontSize,
    observableNotificationRadius,
    observableDistanceY,
    observableDistanceX,
    observableNestedShift,

    operatorFontSize,
    operatorLightHeight,
    operatorPadding,
    operatorBgColorLight,
    operatorBgColorDark,
    operatorObservableFontSize,
    operatorObservableNotificationRadius,
    operatorObservableDistanceY,
    operatorObservableDistanceX,
    operatorObservableNestedShift
  }
}
