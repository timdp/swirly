const { drawNotification } = require('./notification')
const { createDrawObservable } = require('./observable-factory')
const { createElement } = require('../util/create-element')
const { translate } = require('../util/transform')

const drawObservableImpl = createDrawObservable(drawNotification)

const scaleTime = time => time

const drawObservable = (ctx, observable) => {
  const { document, styles } = ctx

  const { element: $observableGroup, bbox } = drawObservableImpl(
    ctx,
    scaleTime,
    observable
  )

  const $outerGroup = createElement(document, 'g')

  $outerGroup.appendChild(
    createElement(
      document,
      'text',
      {
        x: 0,
        y: styles.event_radius,
        fill: styles.observable_title_color,
        'font-family': styles.observable_title_font_family,
        'font-size': styles.observable_title_font_size + 'px',
        'font-weight': styles.observable_title_font_weight,
        'font-style': styles.observable_title_font_style,
        'dominant-baseline': 'middle'
      },
      observable.title
    )
  )

  $outerGroup.appendChild($observableGroup)
  translate($observableGroup, styles.observable_title_width, 0)

  bbox.x1 = 0
  bbox.x2 += styles.observable_title_width

  return {
    element: $outerGroup,
    bbox
  }
}

module.exports = { drawObservable }
