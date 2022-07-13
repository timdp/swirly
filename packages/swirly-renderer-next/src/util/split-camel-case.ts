export function * splitCamelCase (value: string): Iterable<string> {
  let part = ''

  for (const char of value) {
    const lower = char.toLowerCase()

    if (lower !== char) {
      if (part !== '') {
        yield part
      }

      part = lower
      continue
    }

    part += lower
  }

  if (part !== '') {
    yield part
  }
}
