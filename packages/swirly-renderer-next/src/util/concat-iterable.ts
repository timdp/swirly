export function * concatIterable<T> (
  ...args: readonly Iterable<T>[]
): Iterable<T> {
  for (const iterable of args) {
    yield * iterable
  }
}
