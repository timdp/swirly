export function * mapIterable<I, O> (
  iterable: Iterable<I>,
  mapper: (value: I) => O
): Iterable<O> {
  for (const value of iterable) {
    yield mapper(value)
  }
}
