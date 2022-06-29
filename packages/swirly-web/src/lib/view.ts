import split from 'split.js'

import { Example, IEventTarget, ScaleMode } from './types.js'
import { onDoubleClick } from './util/double-click.js'
import {
  closeSubmenu,
  createSubmenu,
  createSubmenuButton
} from './util/submenu.js'

const el = <T extends HTMLElement>(className: string) =>
  document.getElementsByClassName(className)[0] as T

export class View {
  static readonly GUTTER_SIZE = 5

  private _eventTarget?: IEventTarget
  private _versionContainer: HTMLSpanElement
  private _themeToggleButton: HTMLButtonElement
  private _saveButton: HTMLButtonElement
  private _saveMenu: HTMLDivElement
  private _saveSpecButton: HTMLButtonElement
  private _saveSvgButton: HTMLButtonElement
  private _savePngButton: HTMLButtonElement
  private _examplesButton: HTMLButtonElement
  private _examplesMenu: HTMLDivElement
  private _inputContainer: HTMLDivElement
  private _specField: HTMLTextAreaElement
  private _resultContainer: HTMLDivElement
  private _diagramContainer: HTMLDivElement
  private _errorContainer: HTMLDivElement

  constructor () {
    this._versionContainer = el('version')
    this._themeToggleButton = el('theme-toggle')
    this._saveButton = el('save')
    this._saveMenu = el('save-menu')
    this._saveSpecButton = el('save-spec')
    this._saveSvgButton = el('save-svg')
    this._savePngButton = el('save-png')
    this._examplesButton = el('examples')
    this._examplesMenu = el('examples-menu')
    this._inputContainer = el('input')
    this._specField = el('spec')
    this._resultContainer = el('result')
    this._diagramContainer = el('diagram')
    this._errorContainer = el('error')
  }

  init (
    eventTarget: IEventTarget,
    version: string,
    code: string,
    darkThemeEnabled: boolean,
    scaleMode: ScaleMode,
    examples: readonly Example[]
  ) {
    this._eventTarget = eventTarget
    this._versionContainer.textContent = `v${version}`
    split([this._inputContainer, this._resultContainer], {
      direction: 'vertical',
      gutterSize: View.GUTTER_SIZE
    })
    createSubmenu(this._saveButton, this._saveMenu)
    createSubmenu(this._examplesButton, this._examplesMenu)
    this._specField.value = code
    this.setDarkThemeEnabled(darkThemeEnabled)
    this.setScaleMode(scaleMode)
    this._addDomListeners()
    this._populateExamplesMenu(examples)
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

  _populateExamplesMenu (examples: readonly Example[]) {
    for (const example of examples) {
      this._examplesMenu.appendChild(
        createSubmenuButton(example.title, () => {
          this._eventTarget!.onExampleRequested(example)
        })
      )
    }
  }

  _addDomListeners () {
    const onSpecificationChange = () => {
      this._eventTarget!.onSpecificationChange(this._specField.value)
    }
    this._specField.addEventListener('change', onSpecificationChange)
    this._specField.addEventListener('keyup', onSpecificationChange)
    onDoubleClick(this._diagramContainer, () => {
      this._eventTarget!.onScaleModeToggleRequested()
    })
    this._themeToggleButton.addEventListener('click', () => {
      this._eventTarget!.onThemeToggleRequested()
    })
    this._saveSpecButton.addEventListener('click', () => {
      closeSubmenu()
      this._eventTarget!.onSpecificationExportRequested()
    })
    this._saveSvgButton.addEventListener('click', () => {
      closeSubmenu()
      this._eventTarget!.onSvgExportRequested()
    })
    this._savePngButton.addEventListener('click', () => {
      closeSubmenu()
      this._eventTarget!.onPngExportRequested()
    })
  }

  _setControlsEnabled (enabled: boolean) {
    this._saveSvgButton.disabled = !enabled
    this._savePngButton.disabled = !enabled
  }
}
