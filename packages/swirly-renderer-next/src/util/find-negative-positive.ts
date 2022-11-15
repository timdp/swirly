export function findNegativePositive (
  iterable: Iterable<number>
): [negative: number, positive: number] {
  let negative = 0
  let positive = 0

  for (const offset of iterable) {
    negative = Math.min(negative, offset)
    positive = Math.max(positive, offset)
  }

  return [negative, positive]
}
