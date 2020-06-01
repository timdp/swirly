import split from 'split.js'

import { IEventTarget, ScaleMode } from './types'

const el = <T extends HTMLElement>(className: string) =>
  document.querySelector('.' + className) as T

export class View {
  static readonly GUTTER_SIZE = 5

  static readonly DOUBLECLICK_INTERVAL = 500

  private _versionContainer: HTMLSpanElement
  private _themeToggleButton: HTMLButtonElement
  private _exportSvgButton: HTMLButtonElement
  private _exportPngButton: HTMLButtonElement
  private _inputContainer: HTMLDivElement
  private _specField: HTMLTextAreaElement
  private _resultContainer: HTMLDivElement
  private _diagramContainer: HTMLDivElement
  private _errorContainer: HTMLDivElement
  private _eventTarget?: IEventTarget
  private _lastSvgClick: number

  constructor () {
    this._versionContainer = el('version')
    this._themeToggleButton = el('theme-toggle')
    this._exportSvgButton = el('export-svg')
    this._exportPngButton = el('export-png')
    this._inputContainer = el('input')
    this._specField = el('spec')
    this._resultContainer = el('result')
    this._diagramContainer = el('diagram')
    this._errorContainer = el('error')
    this._lastSvgClick = 0
  }

  init (
    eventTarget: IEventTarget,
    version: string,
    code: string,
    darkThemeEnabled: boolean,
    scaleMode: ScaleMode
  ) {
    this._eventTarget = eventTarget
    this._versionContainer.textContent = `v${version}`
    split([this._inputContainer, this._resultContainer], {
      direction: 'vertical',
      gutterSize: View.GUTTER_SIZE
    })
    this._specField.value = code
    this.setDarkThemeEnabled(darkThemeEnabled)
    this.setScaleMode(scaleMode)
    this._addDomListeners()
  }

  getDiagramSvgXml (): string {
    return this._diagramContainer.innerHTML
  }

  setDiagramRendering (svgElement: SVGElement) {
    this._lastSvgClick = 0
    svgElement.addEventListener('click', () => {
      this._onSvgClick()
    })
    this._resultContainer.classList.remove('failed')
    this._diagramContainer.innerHTML = ''
    this._diagramContainer.appendChild(svgElement)
    this._setControlsEnabled(true)
  }

  setRenderErrorMessage (message: string) {
    this._resultContainer.classList.add('failed')
    this._errorContainer.textContent = message
    this._setControlsEnabled(false)
  }

  setDarkThemeEnabled (enabled: boolean) {
    document.body.classList.toggle('dark', enabled)
  }

  setScaleMode (scaleMode: ScaleMode) {
    this._diagramContainer.classList.toggle('scale-fit', scaleMode === 'fit')
  }

  _addDomListeners () {
    const onSpecificationChange = () => {
      this._eventTarget!.onSpecificationChange(this._specField.value)
    }
    this._specField.addEventListener('change', onSpecificationChange)
    this._specField.addEventListener('keyup', onSpecificationChange)
    this._themeToggleButton.addEventListener('click', () => {
      this._eventTarget!.onThemeToggleRequested()
    })
    this._exportSvgButton.addEventListener('click', () => {
      this._eventTarget!.onSvgExportRequested()
    })
    this._exportPngButton.addEventListener('click', () => {
      this._eventTarget!.onPngExportRequested()
    })
  }

  _setControlsEnabled (enabled: boolean) {
    this._exportSvgButton.disabled = !enabled
    this._exportPngButton.disabled = !enabled
  }

  _onSvgClick () {
    const now = Date.now()
    const elapsed = now - this._lastSvgClick
    if (elapsed < View.DOUBLECLICK_INTERVAL) {
      this._lastSvgClick = 0
      this._eventTarget!.onScaleModeToggleRequested()
    } else {
      this._lastSvgClick = now
    }
  }
}
