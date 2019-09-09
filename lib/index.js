const { DOMParser } = require('xmldom')
const YAML = require('js-yaml')
const fs = require('fs')
const path = require('path')
const { drawObservable } = require('./draw/observable')
const { createElement } = require('./util/create-element')
const { translate } = require('./util/transform')

const DEFAULTS_PATH = path.resolve(__dirname, '../etc/defaults.yml')
const XML = '<svg xmlns="http://www.w3.org/2000/svg"/>'
const MIME_TYPE = 'text/xml'

const defaults = YAML.safeLoad(fs.readFileSync(DEFAULTS_PATH, 'utf8'))

const draw = spec => {
  const document = new DOMParser().parseFromString(XML, MIME_TYPE)
  const $svg = document.documentElement

  const styles = {
    ...defaults.styles,
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

  let maxX = 0
  let y = 0
  for (const observable of spec.observables) {
    const { element, bbox } = drawObservable(ctx, observable)
    translate(element, 0, y - bbox.y1)
    $group.appendChild(element)
    maxX = Math.max(maxX, bbox.x2)
    const height = bbox.y2 - bbox.y1
    y += height + styles.observable_spacing
  }

  y -= styles.observable_spacing

  const width = styles.canvas_padding + maxX + styles.canvas_padding
  const height = styles.canvas_padding + y + styles.canvas_padding
  $svg.setAttribute('width', width)
  $svg.setAttribute('height', height)
  $bg.setAttribute('width', width)
  $bg.setAttribute('height', height)

  return {
    document,
    width,
    height
  }
}

module.exports = { draw }
