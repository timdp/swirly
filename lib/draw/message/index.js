const streamMessageStrategy = require('./stream')
const nonStreamMessageStrategy = require('./non-stream')

const drawMessage = (ctx, message, dy) => {
  const { draw } = streamMessageStrategy.supports(message)
    ? streamMessageStrategy
    : nonStreamMessageStrategy
  return draw(ctx, message, dy)
}

module.exports = { drawMessage }
