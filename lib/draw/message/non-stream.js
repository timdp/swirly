const strategies = [
  require('./complete'),
  require('./error'),
  require('./scalar')
]

const supports = ({ notification: { value } }) =>
  value == null || typeof value !== 'object'

const draw = (ctx, message) => {
  const { draw } = strategies.find(({ supports }) => supports(message))
  return draw(ctx, message)
}

module.exports = {
  supports,
  draw
}
