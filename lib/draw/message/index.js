const streamMessageStrategy = require('./stream')
const nonStreamMessageStrategy = require('./non-stream')

const drawMessage = (ctx, message, options) => {
  const { draw } = streamMessageStrategy.supports(message)
    ? streamMessageStrategy
    : nonStreamMessageStrategy
  return draw(ctx, message, options)
}

module.exports = { drawMessage }
