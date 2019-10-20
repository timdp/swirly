const removeCr = str =>
  str.endsWith('\r') ? str.substring(0, str.length - 1) : str

function * byLine (str) {
  let prevIdx = -1
  let idx = str.indexOf('\n')

  while (idx >= 0) {
    yield removeCr(str.substring(prevIdx + 1, idx))
    prevIdx = idx
    idx = str.indexOf('\n', idx + 1)
  }

  if (prevIdx >= 0) {
    yield removeCr(str.substring(prevIdx + 1))
  }
}

module.exports = { byLine }
