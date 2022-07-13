import { XmlNode } from './xml-node'

export class XmlFragment extends XmlNode {
  public constructor (private readonly _children: readonly XmlNode[]) {
    super()
  }

  public toXmlString (): string {
    let result = ''

    for (const child of this._children) {
      result += child.toXmlString()
    }

    return result
  }
}
