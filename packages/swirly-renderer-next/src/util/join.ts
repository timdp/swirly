export function join (iterable: Iterable<string>, separator: string): string {
  let result = ''
  let first = true

  for (const value of iterable) {
    if (first) {
      first = false
    } else {
      result += separator
    }

    result += value
  }

  return result
}
