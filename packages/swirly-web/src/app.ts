import 'core-js/stable'

import split from 'split.js'
import { parseMarbleDiagramSpec } from 'swirly-parser'
import { renderMarbleDiagram } from 'swirly-renderer'
import { styles as darkStyles } from 'swirly-theme-default-dark'
import { styles as lightStyles } from 'swirly-theme-default-light'

import { version } from '../package.json'

const GUTTER_SIZE = 5
const EXAMPLE = `% An example application of the concatAll operator.
% Edit this code to redraw the diagram in real time.

x = ----a------b------|

y = ---c-d---|

z = ---e--f-|

-x---y----z------|

> concatAll

-----a------b---------c-d------e--f-|`

const el = (className: string) => document.querySelector('.' + className)
const versionContainer = el('version') as HTMLSpanElement
const resultContainer = el('result') as HTMLDivElement
const inputContainer = el('input') as HTMLDivElement
const specField = el('spec') as HTMLTextAreaElement
const themeToggleButton = el('theme-toggle') as HTMLButtonElement
const exportSvgButton = el('export-svg') as HTMLButtonElement
const exportPngButton = el('export-png') as HTMLButtonElement

let lastRendered: string = ''
let darkThemeEnabled: boolean = false

const setControlsEnabled = (enabled: boolean) => {
  exportSvgButton.disabled = !enabled
  exportPngButton.disabled = !enabled
}

const createErrorContainer = (msg: string): HTMLDivElement => {
  const div = document.createElement('div')
  div.className = 'error'
  div.innerText = msg
  return div
}

const renderResult = (element: HTMLElement, isError: boolean) => {
  resultContainer.innerHTML = ''
  resultContainer.appendChild(element)
  setControlsEnabled(!isError)
}

const update = () => {
  const code = specField.value

  const serialized = darkThemeEnabled + ';' + code
  if (lastRendered === serialized) {
    return
  }
  lastRendered = serialized

  try {
    const spec = parseMarbleDiagramSpec(code)
    const styles = darkThemeEnabled ? darkStyles : lightStyles
    const {
      document: { documentElement: svgElement }
    } = renderMarbleDiagram(spec, { styles })
    renderResult(svgElement, false)
  } catch (err) {
    const errorContainer = createErrorContainer(err.stack)
    renderResult(errorContainer, true)
  }
}

const getSvgDataUri = () =>
  'data:image/svg+xml,' + encodeURI(resultContainer.innerHTML)

const download = (dataUri: string, name: string) => {
  const a = document.createElement('a')
  a.href = dataUri
  a.download = name
  a.click()
}

const toggleTheme = () => {
  darkThemeEnabled = !darkThemeEnabled
  themeToggleButton.textContent = darkThemeEnabled ? 'Dark' : 'Light'
  document.body.className = darkThemeEnabled ? 'dark' : ''
  update()
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
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0)
    download(canvas.toDataURL('image/png'), 'diagram.png')
  }
  image.src = getSvgDataUri()
}

split([resultContainer, inputContainer], {
  direction: 'vertical',
  gutterSize: GUTTER_SIZE
})

versionContainer.textContent = `v${version}`
specField.value = EXAMPLE

specField.addEventListener('change', update)
specField.addEventListener('keyup', update)
themeToggleButton.addEventListener('click', toggleTheme)
exportSvgButton.addEventListener('click', exportSvg)
exportPngButton.addEventListener('click', exportPng)

update()
