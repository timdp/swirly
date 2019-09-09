const observableEventStrategy = require('./observable')
const nonObservableEventStrategy = require('./non-observable')

const drawEvent = (ctx, event) => {
  const { draw } = observableEventStrategy.supports(event)
    ? observableEventStrategy
    : nonObservableEventStrategy
  return draw(ctx, event)
}

module.exports = { drawEvent }
