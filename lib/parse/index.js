const { parsers } = require('./parsers')
const { byBlock } = require('./util/by-block')

const parseMarbleDiagramSpec = str => {
  const ctx = { content: [], styles: {}, allValues: {} }

  for (const lines of byBlock(str)) {
    const { run } = parsers.find(({ match }) => match(lines[0]))
    run(lines, ctx)
  }

  return ctx
}

module.exports = { parseMarbleDiagramSpec }
