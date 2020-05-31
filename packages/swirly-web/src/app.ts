import 'core-js/stable'

import split from 'split.js'
import { parseMarbleDiagramSpec } from 'swirly-parser'
import { renderMarbleDiagram } from 'swirly-renderer'
import { styles as darkStyles } from 'swirly-theme-default-dark'
import { styles as lightStyles } from 'swirly-theme-default-light'

declare const VERSION: string

type ScaleMode = 'fit' | 'none'

type State = {
  code: string
  darkThemeEnabled: boolean
  scaleMode: ScaleMode
}

const EXAMPLE_CODE = `% An example application of the concatAll operator.
% Edit this code to redraw the diagram in real time.

x = ----a------b------|

y = ---c-d---|

z = ---e--f-|

-x---y----z------|

> concatAll

-----a------b---------c-d------e--f-|`

const GUTTER_SIZE = 5

const DOUBLECLICK_INTERVAL = 500

const DEFAULT_STATE: State = {
  code: EXAMPLE_CODE,
  darkThemeEnabled: false,
  scaleMode: 'fit'
}

let lastRendered: string = ''
let darkThemeEnabled: boolean
let scaleMode: ScaleMode
let lastSvgClick: number = 0

const el = (className: string) => document.querySelector('.' + className)
const versionContainer = el('version') as HTMLSpanElement
const themeToggleButton = el('theme-toggle') as HTMLButtonElement
const exportSvgButton = el('export-svg') as HTMLButtonElement
const exportPngButton = el('export-png') as HTMLButtonElement
const inputContainer = el('input') as HTMLDivElement
const specField = el('spec') as HTMLTextAreaElement
const resultContainer = el('result') as HTMLDivElement

const readState = (): State => {
  let state
  try {
    state = JSON.parse(window.localStorage.state)
  } catch (_) {}
  if (state == null || typeof state !== 'object') {
    state = DEFAULT_STATE
  }
  if (typeof state.code !== 'string' || state.code.trim() === '') {
    state.code = DEFAULT_STATE.code
  }
  if (state.scaleMode == null) {
    state.scaleMode = 'fit'
  }
  return state
}

const writeState = () => {
  const state: State = {
    code: specField.value,
    darkThemeEnabled,
    scaleMode
  }
  try {
    window.localStorage.state = JSON.stringify(state)
  } catch (_) {}
}

const setControlsEnabled = (enabled: boolean) => {
  exportSvgButton.disabled = !enabled
  exportPngButton.disabled = !enabled
}

const setScaleMode = (mode: ScaleMode) => {
  scaleMode = mode
  resultContainer.className = 'result' + (mode === 'fit' ? ' fit' : '')
}

const toggleScaleMode = () => {
  setScaleMode(scaleMode === 'fit' ? 'none' : 'fit')
}

const setDarkThemeEnabled = (value: boolean) => {
  darkThemeEnabled = value
  document.body.className = darkThemeEnabled ? 'dark' : ''
  update()
}

const toggleTheme = () => {
  setDarkThemeEnabled(!darkThemeEnabled)
}

const onSvgClick = () => {
  const now = Date.now()
  const elapsed = now - lastSvgClick
  if (elapsed < DOUBLECLICK_INTERVAL) {
    lastSvgClick = 0
    toggleScaleMode()
    writeState()
  } else {
    lastSvgClick = now
  }
}

const renderResult = (element: HTMLElement, isError: boolean) => {
  resultContainer.innerHTML = ''
  resultContainer.appendChild(element)
  if (!isError) {
    element.addEventListener('click', onSvgClick)
  }
  setControlsEnabled(!isError)
}

const createErrorContainer = (msg: string): HTMLDivElement => {
  const div = document.createElement('div')
  div.className = 'error'
  div.innerText = msg
  return div
}

const update = () => {
  const code = specField.value

  const serialized = darkThemeEnabled + ';' + code
  if (lastRendered === serialized) {
    return
  }
  lastRendered = serialized

  writeState()

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

const updateBodyHeight = () => {
  document.body.style.height = window.innerHeight + 'px'
}

updateBodyHeight()
window.addEventListener('resize', updateBodyHeight)
window.addEventListener('orientationchange', updateBodyHeight)

split([inputContainer, resultContainer], {
  direction: 'vertical',
  gutterSize: GUTTER_SIZE
})

specField.addEventListener('change', update)
specField.addEventListener('keyup', update)
themeToggleButton.addEventListener('click', toggleTheme)
exportSvgButton.addEventListener('click', exportSvg)
exportPngButton.addEventListener('click', exportPng)

versionContainer.textContent = `v${VERSION}`
const state = readState()
specField.value = state.code
setDarkThemeEnabled(!!state.darkThemeEnabled)
setScaleMode(state.scaleMode)
update()
