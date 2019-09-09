const strategies = [
  require('./complete'),
  require('./error'),
  require('./scalar')
]

const supports = ({ value }) => value == null || typeof value !== 'object'

const draw = (ctx, notification) => {
  const { draw } = strategies.find(({ supports }) => supports(notification))
  return draw(ctx, notification)
}

module.exports = {
  supports,
  draw
}
