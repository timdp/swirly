import { XmlFragment } from './xml-fragment'
import { XmlNode } from './xml-node'

export function fragment (children: readonly XmlNode[]): XmlFragment {
  return new XmlFragment(children)
}
