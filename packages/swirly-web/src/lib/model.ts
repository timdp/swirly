import { ScaleMode } from './types.js'

export class Model {
  code: string = ''
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
