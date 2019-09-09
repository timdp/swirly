const observableNotificationStrategy = require('./observable')
const nonObservableNotificationStrategy = require('./non-observable')

const drawNotification = (ctx, notification) => {
  const { draw } = observableNotificationStrategy.supports(notification)
    ? observableNotificationStrategy
    : nonObservableNotificationStrategy
  return draw(ctx, notification)
}

module.exports = { drawNotification }
