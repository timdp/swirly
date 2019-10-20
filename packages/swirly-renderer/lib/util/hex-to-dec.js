const A = 'A'.charCodeAt(0)
const ZERO = '0'.charCodeAt(0)

const hexToDec = hex => {
  let dec = 0
  hex = hex.toUpperCase()
  for (let i = 0; i < hex.length; ++i) {
    const c = hex.charCodeAt(i)
    dec = (dec << 4) + (c >= A ? c - A + 10 : c - ZERO)
  }
  return dec
}

module.exports = { hexToDec }
