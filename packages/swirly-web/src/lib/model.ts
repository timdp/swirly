import { ScaleMode } from './types'

const EXAMPLE_CODE = `% An example application of the concatAll operator.
% Edit this code to redraw the diagram in real time.

x = ----a------b------|

y = ---c-d---|

z = ---e--f-|

-x---y----z------|

> concatAll

-----a------b---------c-d------e--f-|`

export class Model {
  code: string = EXAMPLE_CODE
  darkThemeEnabled: boolean = false
  scaleMode: ScaleMode = 'fit'

  toJSON () {
    return {
      code: this.code,
      darkThemeEnabled: this.darkThemeEnabled,
      scaleMode: this.scaleMode
    }
  }
}
