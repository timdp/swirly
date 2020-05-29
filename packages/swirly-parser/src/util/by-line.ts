const removeCr = (str: string): string =>
  str.endsWith('\r') ? str.substring(0, str.length - 1) : str

export function * byLine (str: string): Generator<string, void, undefined> {
  let prevIdx = -1
  let idx = str.indexOf('\n')

  while (idx >= 0) {
    yield removeCr(str.substring(prevIdx + 1, idx))
    prevIdx = idx
    idx = str.indexOf('\n', idx + 1)
  }

  const lastLine = removeCr(str.substring(prevIdx + 1))
  if (lastLine !== '') {
    yield lastLine
  }
}
