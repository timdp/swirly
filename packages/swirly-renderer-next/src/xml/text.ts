import { XmlText } from './xml-text'

export function text (value: string): XmlText {
  return new XmlText(value)
}
