const streamMessageStrategy = require('./stream')
const nonStreamMessageStrategy = require('./non-stream')

const drawMessage = (ctx, message) => {
  const { draw } = streamMessageStrategy.supports(message)
    ? streamMessageStrategy
    : nonStreamMessageStrategy
  return draw(ctx, message)
}

module.exports = { drawMessage }
