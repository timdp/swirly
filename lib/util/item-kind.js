const ItemKind = {
  NEXT: 'N',
  ERROR: 'E',
  COMPLETE: 'C',
  STREAM: 'S',
  OPERATOR: 'O'
}

const allowedChars = Object.values(ItemKind)

const normalize = kindStr => {
  if (typeof kindStr !== 'string') {
    return ItemKind.NEXT
  }
  const firstChar = kindStr.charAt(0).toUpperCase()
  if (!allowedChars.includes(firstChar)) {
    return ItemKind.NEXT
  }
  return firstChar
}

ItemKind.is = (a, b) => a === normalize(b)

module.exports = { ItemKind }
