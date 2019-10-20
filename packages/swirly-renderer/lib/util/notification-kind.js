const NotificationKind = {
  NEXT: 'N',
  ERROR: 'E',
  COMPLETE: 'C'
}

const allowedChars = Object.values(NotificationKind)

const normalize = kindStr => {
  if (typeof kindStr !== 'string') {
    return NotificationKind.NEXT
  }
  const firstChar = kindStr.charAt(0).toUpperCase()
  if (!allowedChars.includes(firstChar)) {
    return NotificationKind.NEXT
  }
  return firstChar
}

NotificationKind.is = (a, b) => a === normalize(b)

module.exports = { NotificationKind }
