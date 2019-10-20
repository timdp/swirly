const strategies = {
  barrier: require('./barrier'),
  range: require('./range')
}

const drawDecoration = (ctx, decoration) => {
  const { draw } = strategies[decoration.kind]
  return draw(ctx, decoration)
}

module.exports = { drawDecoration }
