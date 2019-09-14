const { drawStream } = require('./stream')
const { drawOperator } = require('./operator')
const { createElement } = require('../util/create-element')
const { translate } = require('../util/transform')
const DEFAULT_STYLES = require('./default-styles.json')

const EMPTY_SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>'
const MIME_TYPE = 'image/svg+xml'

const drawMarbleDiagram = (spec, options = {}) => {
  const DOMParserImpl =
    options.DOMParser != null ? options.DOMParser : DOMParser
  const document = new DOMParserImpl().parseFromString(EMPTY_SVG, MIME_TYPE)
  const $svg = document.documentElement

  const styles = {
    ...DEFAULT_STYLES,
    ...spec.styles
  }

  const $bg = createElement(document, 'rect', {
    x: 0,
    y: 0,
    fill: styles.background_color
  })
  $svg.appendChild($bg)

  const $group = createElement(document, 'g')
  translate($group, styles.canvas_padding, styles.canvas_padding)
  $svg.appendChild($group)

  const ctx = { document, styles }

  const updaters = []

  let maxX = 0
  let y = 0
  for (const stream of spec.streams) {
    const draw = stream.messages != null ? drawStream : drawOperator

    const { element, bbox, update } = draw(ctx, stream)
    translate(element, 0, y - bbox.y1)
    $group.appendChild(element)

    maxX = Math.max(maxX, bbox.x2)

    const height = bbox.y2 - bbox.y1
    y += height + styles.stream_spacing

    if (update != null) {
      updaters.push(update)
    }
  }

  y -= styles.stream_spacing

  const width = styles.canvas_padding + maxX + styles.canvas_padding
  const height = styles.canvas_padding + y + styles.canvas_padding

  $svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  $svg.setAttribute('width', width)
  $svg.setAttribute('height', height)

  $bg.setAttribute('width', width)
  $bg.setAttribute('height', height)

  for (const update of updaters) {
    update({ width: maxX, height: y })
  }

  return {
    document,
    width,
    height
  }
}

module.exports = { drawMarbleDiagram }
