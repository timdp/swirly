const hexToDec = hex => {
  let dec = 0
  hex = hex.toUpperCase()
  for (let i = 0; i < hex.length; ++i) {
    const c = hex.charCodeAt(i)
    dec = dec * 16 + (c >= 65 ? c - 55 : c - 48)
  }
  return dec
}

module.exports = {
  hexToDec
}
