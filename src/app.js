import '@babel/polyfill'
import { drawMarbleDiagram, parseMarbleDiagramSpec } from '../lib/'
import { version } from '../package.json'

const EXAMPLE = `% An example application of the concatAll operator.
% Edit this code to redraw the diagram in real time.

x = ----a------b------|

y = ---c-d---|

z = ---e--f-|

-x---y----z------|

> concatAll

-----a------b---------c-d------e--f-|`

const versionContainer = document.querySelector('.version')
const resultContainer = document.querySelector('.result')
const specField = document.querySelector('.spec')
const exportSvgButton = document.querySelector('.export-svg')
const exportPngButton = document.querySelector('.export-png')

let lastRendered = ''

const setControlsEnabled = enabled => {
  exportSvgButton.disabled = !enabled
  exportPngButton.disabled = !enabled
}

const createErrorContainer = msg => {
  const div = document.createElement('div')
  div.className = 'error'
  div.innerText = msg
  return div
}

const update = () => {
  const value = specField.value

  if (lastRendered === value) {
    return
  }
  lastRendered = value

  resultContainer.innerHTML = ''

  try {
    const spec = parseMarbleDiagramSpec(value)
    const {
      document: { documentElement: svgElement }
    } = drawMarbleDiagram(spec)
    resultContainer.appendChild(svgElement)
  } catch (err) {
    setControlsEnabled(false)
    resultContainer.appendChild(createErrorContainer(err.stack))
    return
  }

  setControlsEnabled(true)
}

const getSvgDataUri = () => 'data:image/svg+xml,' + resultContainer.innerHTML

const download = (dataUri, name) => {
  const a = document.createElement('a')
  a.href = dataUri
  a.download = name
  a.click()
}

const exportSvg = () => {
  download(getSvgDataUri(), 'diagram.svg')
}

const exportPng = () => {
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    download(canvas.toDataURL('image/png'), 'diagram.png')
  }
  image.src = getSvgDataUri()
}

specField.addEventListener('change', update)
specField.addEventListener('keyup', update)
exportSvgButton.addEventListener('click', exportSvg)
exportPngButton.addEventListener('click', exportPng)

versionContainer.textContent = `v${version}`

specField.value = EXAMPLE
update()
