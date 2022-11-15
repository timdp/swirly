import { escapeXml } from './escape-xml'
import { XmlFragment } from './xml-fragment'
import { XmlNode } from './xml-node'
import { XmlTagAttrs } from './xml-tag-attrs'

export class XmlTag extends XmlFragment {
  public constructor (
    private readonly _tagName: string,
    private readonly _attrs: XmlTagAttrs,
    children: readonly XmlNode[]
  ) {
    super(children)
  }

  public override toXmlString (): string {
    let attrs = ''
    const tag = this._tagName
    const children: string = super.toXmlString()

    for (const [key, value] of Object.entries(this._attrs)) {
      attrs += ` ${escapeXml(key)}="${escapeXml(String(value))}"`
    }

    return children.length === 0
      ? `<${tag}${attrs} />`
      : `<${tag}${attrs}>${children}</${tag}>`
  }
}
