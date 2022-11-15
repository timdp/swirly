import { EMPTY_CHILDREN } from './empty-children'
import { XmlNode } from './xml-node'
import { XmlTag } from './xml-tag'
import { XmlTagAttrs } from './xml-tag-attrs'

export function tag (
  name: string,
  attrs: XmlTagAttrs,
  children: readonly XmlNode[] = EMPTY_CHILDREN
): XmlTag {
  return new XmlTag(name, attrs, children)
}
