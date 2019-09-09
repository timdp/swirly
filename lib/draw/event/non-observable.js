const strategies = [
  require('./complete'),
  require('./error'),
  require('./scalar')
]

const supports = event => event.observable == null

const draw = (ctx, event) => {
  const { draw } = strategies.find(({ supports }) => supports(event))
  return draw(ctx, event)
}

module.exports = {
  supports,
  draw
}
