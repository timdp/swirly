import { byLine } from './by-line.js'

const reComment = /^\s*%/

const isComment = (line: string): boolean => reComment.test(line)

export function * byBlock (str: string): Generator<string[], void, undefined> {
  const acc = []

  for (const line of byLine(str)) {
    if (isComment(line)) {
      continue
    }

    if (line.trim() === '') {
      if (acc.length > 0) {
        yield acc.slice()
        acc.length = 0
      }
    } else {
      acc.push(line)
    }
  }

  if (acc.length > 0) {
    yield acc
  }
}
