import '@babel/polyfill'
import { drawMarbleDiagram, parseMarbleDiagramSpec } from '../lib/'

const EXAMPLE = `# An example application of the concatAll operator.
# Edit this code to redraw the diagram in real time.

x
----a------b------|
hidden

y
---c-d---|
hidden

z
---e--f-|
hidden

input
-x---y----z------|

output
-----a------b---------c-d------e--f-|
`

const resultContainer = document.querySelector('.result')
const inputField = document.querySelector('.input textarea')
const exportSvgButton = document.querySelector('.export-svg')
const exportPngButton = document.querySelector('.export-png')

let lastRendered = ''

const emptyElement = element => {
  while (element.firstChild != null) {
    element.removeChild(element.firstChild)
  }
}

const setControlsEnabled = enabled => {
  exportSvgButton.disabled = !enabled
  exportPngButton.disabled = !enabled
}

const update = () => {
  const value = inputField.value

  if (lastRendered === value) {
    return
  }

  emptyElement(resultContainer)

  try {
    const spec = parseMarbleDiagramSpec(value)
    const {
      document: { documentElement: svgElement }
    } = drawMarbleDiagram(spec)
    resultContainer.appendChild(svgElement)
  } catch (err) {
    console.error(err)
    setControlsEnabled(false)
    return
  }

  lastRendered = value
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

inputField.addEventListener('change', update)
inputField.addEventListener('keyup', update)
exportSvgButton.addEventListener('click', exportSvg)
exportPngButton.addEventListener('click', exportPng)

inputField.value = EXAMPLE
update()
