const { drawNotification } = require('./notification')
const { createDrawObservable } = require('./observable-factory')
const { createElement } = require('../util/create-element')
const { mergeStyles } = require('../util/merge-styles')
const { translate } = require('../util/transform')

const drawObservableImpl = createDrawObservable(drawNotification)

const scaleTime = time => time

const drawObservable = (ctx, observable) => {
  const { document, styles } = ctx
  const s = mergeStyles('observable_', styles, observable)

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
        fill: s.title_color,
        'font-family': s.title_font_family,
        'font-size': s.title_font_size + 'px',
        'font-weight': s.title_font_weight,
        'font-style': s.title_font_style,
        'dominant-baseline': 'middle'
      },
      observable.title
    )
  )

  $outerGroup.appendChild($observableGroup)
  translate($observableGroup, s.title_width, 0)

  bbox.x1 = 0
  bbox.x2 += s.title_width

  return {
    element: $outerGroup,
    bbox
  }
}

module.exports = { drawObservable }
