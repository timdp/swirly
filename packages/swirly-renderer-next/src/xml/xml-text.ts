import { escapeXml } from './escape-xml'
import { XmlNode } from './xml-node'

export class XmlText extends XmlNode {
  public constructor (private readonly _text: string) {
    super()
  }

  public override toXmlString (): string {
    return escapeXml(this._text)
  }
}
