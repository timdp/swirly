const { drawEvent } = require('./event')
const { createDrawObservable } = require('./observable-factory')
const { createElement } = require('../util/create-element')
const { translate } = require('../util/transform')

const drawObservableImpl = createDrawObservable(drawEvent)

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
        fill: styles.observable_label_color,
        'font-family': styles.observable_label_font_family,
        'font-size': styles.observable_label_font_size + 'px',
        'font-weight': styles.observable_label_font_weight,
        'font-style': styles.observable_label_font_style,
        'dominant-baseline': 'middle'
      },
      observable.label
    )
  )

  $outerGroup.appendChild($observableGroup)
  translate($observableGroup, styles.observable_label_width, 0)

  bbox.x1 = 0
  bbox.x2 += styles.observable_label_width

  return {
    element: $outerGroup,
    bbox
  }
}

module.exports = { drawObservable }
