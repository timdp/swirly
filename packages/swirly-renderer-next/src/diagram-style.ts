export interface DiagramStyle {
  readonly padding: number
  readonly rowGap: number
  readonly bgColorLight: string
  readonly bgColorDark: string
  readonly textColorLight: string
  readonly textColorDark: string

  readonly titleFontSize: number
  readonly titleMarginRight: number

  readonly strokeWidth: number
  readonly strokeColorLight: string
  readonly strokeColorDark: string
  readonly ghostOpacity: number

  readonly observableFontSize: number
  readonly observableNotificationRadius: number
  readonly observableDistanceX: number
  readonly observableDistanceY: number
  readonly observableNestedShift: number

  readonly operatorFontSize: number
  readonly operatorLightHeight: number
  readonly operatorPadding: number
  readonly operatorBgColorLight: string
  readonly operatorBgColorDark: string
  readonly operatorObservableFontSize: number
  readonly operatorObservableNotificationRadius: number
  readonly operatorObservableDistanceX: number
  readonly operatorObservableDistanceY: number
  readonly operatorObservableNestedShift: number
}
