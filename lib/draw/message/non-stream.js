const strategies = [
  require('./complete'),
  require('./error'),
  require('./scalar')
]

const supports = ({ notification: { value } }) =>
  value == null || typeof value !== 'object'

const draw = (ctx, message, options) => {
  const { draw } = strategies.find(({ supports }) => supports(message))
  return draw(ctx, message, options)
}

module.exports = {
  supports,
  draw
}
