import split from 'split.js'

import { onDoubleClick } from './double-click'
import { IEventTarget, ScaleMode } from './types'

const el = <T extends HTMLElement>(selector: string) =>
  document.querySelector(selector) as T

export class View {
  static readonly GUTTER_SIZE = 5

  private _versionContainer: HTMLSpanElement
  private _themeToggleButton: HTMLButtonElement
  private _exportSpecButton: HTMLButtonElement
  private _exportSvgButton: HTMLButtonElement
  private _exportPngButton: HTMLButtonElement
  private _inputContainer: HTMLDivElement
  private _specField: HTMLTextAreaElement
  private _resultContainer: HTMLDivElement
  private _diagramContainer: HTMLDivElement
  private _errorContainer: HTMLDivElement

  constructor () {
    this._versionContainer = el('.version')
    this._themeToggleButton = el('.theme-toggle')
    this._exportSpecButton = el('.export-spec button')
    this._exportSvgButton = el('.export-svg button')
    this._exportPngButton = el('.export-png button')
    this._inputContainer = el('.input')
    this._specField = el('.spec')
    this._resultContainer = el('.result')
    this._diagramContainer = el('.diagram')
    this._errorContainer = el('.error')
  }

  init (
    eventTarget: IEventTarget,
    version: string,
    code: string,
    darkThemeEnabled: boolean,
    scaleMode: ScaleMode
  ) {
    this._versionContainer.textContent = `v${version}`
    split([this._inputContainer, this._resultContainer], {
      direction: 'vertical',
      gutterSize: View.GUTTER_SIZE
    })
    this._specField.value = code
    this.setDarkThemeEnabled(darkThemeEnabled)
    this.setScaleMode(scaleMode)
    this._addDomListeners(eventTarget)
  }

  getDiagramSvgXml (): string {
    return this._diagramContainer.innerHTML
  }

  setDiagramRendering (svgElement: SVGElement) {
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

  _addDomListeners (eventTarget: IEventTarget) {
    const onSpecificationChange = () => {
      eventTarget.onSpecificationChange(this._specField.value)
    }
    this._specField.addEventListener('change', onSpecificationChange)
    this._specField.addEventListener('keyup', onSpecificationChange)
    onDoubleClick(this._diagramContainer, () => {
      eventTarget.onScaleModeToggleRequested()
    })
    this._themeToggleButton.addEventListener('click', () => {
      eventTarget.onThemeToggleRequested()
    })
    this._exportSpecButton.addEventListener('click', () => {
      eventTarget.onSpecificationExportRequested()
    })
    this._exportSvgButton.addEventListener('click', () => {
      eventTarget.onSvgExportRequested()
    })
    this._exportPngButton.addEventListener('click', () => {
      eventTarget.onPngExportRequested()
    })
  }

  _setControlsEnabled (enabled: boolean) {
    this._exportSvgButton.disabled = !enabled
    this._exportPngButton.disabled = !enabled
  }
}
