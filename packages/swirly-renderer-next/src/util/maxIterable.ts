export function maxIterable (values: Iterable<number>): number {
  let result = -Infinity

  for (const value of values) {
    result = Math.max(value, result)
  }

  return result
}
