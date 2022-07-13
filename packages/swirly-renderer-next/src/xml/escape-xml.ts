const MATCH_XML_REG_EXP = /["'&<>]/

export function escapeXml (str: string): string {
  const match = MATCH_XML_REG_EXP.exec(str)

  if (match === null) {
    return str
  }

  let escape: string
  let result = ''
  let index: number
  let lastIndex = 0

  for ({ index } = match; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 39: // '
        escape = '&#39;'
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      result += str.substring(lastIndex, index)
    }

    lastIndex = index + 1
    result += escape
  }

  return lastIndex !== index ? result + str.substring(lastIndex, index) : result
}
