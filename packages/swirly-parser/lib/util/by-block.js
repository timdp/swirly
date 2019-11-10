const { byLine } = require('./by-line')

const reComment = /^\s*%/

const isComment = line => reComment.test(line)

function * byBlock (str) {
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

module.exports = { byBlock }
