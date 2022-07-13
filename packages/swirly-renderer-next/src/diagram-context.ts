import { Font } from 'opentype.js'

import { DiagramStyle } from './diagram-style'
import { StyleCatcher } from './style-catcher'

export interface DiagramContext {
  readonly style: DiagramStyle
  readonly styleCatcher: StyleCatcher
  readonly font: Font
}
