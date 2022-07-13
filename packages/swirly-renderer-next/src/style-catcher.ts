import { camelCaseToDashCase } from './util/camel-case-to-dash-case'
import { concatIterable } from './util/concat-iterable'
import { indexToCssClass } from './util/index-to-css-class'
import { join } from './util/join'
import { mapIterable } from './util/map-iterable'
import { fragment } from './xml/fragment'
import { text } from './xml/text'
import { XmlNode } from './xml/xml-node'

export class StyleCatcher {
  private readonly _allStore = new Map<string, string>()
  private readonly _darkStore = new Map<string, string>()

  private _index = 0

  private * _getClasses (
    store: Map<string, string>,
    styles: Record<string, string | number>
  ): Iterable<string> {
    for (const [key, value] of Object.entries(styles)) {
      const style = `${camelCaseToDashCase(key)}:${value}`

      let className: string | undefined = store.get(style)

      if (className === undefined) {
        className = indexToCssClass(this._index++)
        store.set(style, className)
      }

      yield className
    }
  }

  public attach (
    all: Record<string, string | number>,
    dark: Record<string, string | number>
  ): string {
    return join(
      concatIterable(
        this._getClasses(this._allStore, all),
        this._getClasses(this._darkStore, dark)
      ),
      ' '
    )
  }

  public toXmlNode (): XmlNode {
    return fragment([
      ...mapIterable(this._allStore, ([style, className]) =>
        text(`.${className}{${style}}`)
      ),
      text('@media (prefers-color-scheme:dark){'),
      ...mapIterable(this._darkStore, ([style, className]) =>
        text(`.${className}{${style}}`)
      ),
      text('}')
    ])
  }
}
