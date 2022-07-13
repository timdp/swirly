import split from 'split.js'

import { Example, IEventTarget, ScaleMode } from './types.js'
import { onDoubleClick } from './util/double-click.js'
import {
  closeSubmenu,
  createSubmenu,
  createSubmenuButton
} from './util/submenu.js'

const reNbsp = /\xA0/g

const el = <T extends HTMLElement>(className: string) =>
  document.getElementsByClassName(className)[0] as T

export class View {
  static readonly GUTTER_SIZE = 5

  #eventTarget?: IEventTarget
  #versionContainer: HTMLSpanElement
  #themeToggleButton: HTMLButtonElement
  #saveButton: HTMLButtonElement
  #saveMenu: HTMLDivElement
  #saveSpecButton: HTMLButtonElement
  #saveSvgButton: HTMLButtonElement
  #savePngButton: HTMLButtonElement
  #examplesButton: HTMLButtonElement
  #examplesMenu: HTMLDivElement
  #inputContainer: HTMLDivElement
  #specField: HTMLTextAreaElement
  #resultContainer: HTMLDivElement
  #diagramContainer: HTMLDivElement
  #errorContainer: HTMLDivElement

  constructor () {
    this.#versionContainer = el('version')
    this.#themeToggleButton = el('theme-toggle')
    this.#saveButton = el('save')
    this.#saveMenu = el('save-menu')
    this.#saveSpecButton = el('save-spec')
    this.#saveSvgButton = el('save-svg')
    this.#savePngButton = el('save-png')
    this.#examplesButton = el('examples')
    this.#examplesMenu = el('examples-menu')
    this.#inputContainer = el('input')
    this.#specField = el('spec')
    this.#resultContainer = el('result')
    this.#diagramContainer = el('diagram')
    this.#errorContainer = el('error')
  }

  init (
    eventTarget: IEventTarget,
    version: string,
    code: string,
    darkThemeEnabled: boolean,
    scaleMode: ScaleMode,
    examples: readonly Example[]
  ) {
    this.#eventTarget = eventTarget
    this.#versionContainer.textContent = `v${version}`
    split([this.#inputContainer, this.#resultContainer], {
      direction: 'vertical',
      gutterSize: View.GUTTER_SIZE
    })
    createSubmenu(this.#saveButton, this.#saveMenu)
    createSubmenu(this.#examplesButton, this.#examplesMenu)
    this.#specField.value = code
    this.setDarkThemeEnabled(darkThemeEnabled)
    this.setScaleMode(scaleMode)
    this.#addDomListeners()
    this.#populateExamplesMenu(examples)
  }

  getDiagramSvgXml (): string {
    const svgElement = this.#diagramContainer.firstElementChild!
    const serializer = new XMLSerializer()
    const xml = serializer.serializeToString(svgElement)
    // Replace non-breaking spaces with named entities
    return xml.replace(reNbsp, '&#xA0;')
  }

  setDiagramRendering (value: string) {
    this.#resultContainer.classList.remove('failed')
    this.#diagramContainer.innerHTML = value
    this.#setControlsEnabled(true)
  }

  setRenderErrorMessage (message: string) {
    this.#resultContainer.classList.add('failed')
    this.#errorContainer.textContent = message
    this.#setControlsEnabled(false)
  }

  setDarkThemeEnabled (enabled: boolean) {
    document.body.classList.toggle('dark', enabled)
  }

  setScaleMode (scaleMode: ScaleMode) {
    this.#diagramContainer.classList.toggle('scale-fit', scaleMode === 'fit')
  }

  #populateExamplesMenu (examples: readonly Example[]) {
    for (const example of examples) {
      this.#examplesMenu.appendChild(
        createSubmenuButton(example.title, () => {
          this.#eventTarget!.onExampleRequested(example)
        })
      )
    }
  }

  #addDomListeners () {
    const onSpecificationChange = () => {
      this.#eventTarget!.onSpecificationChange(this.#specField.value)
    }
    this.#specField.addEventListener('change', onSpecificationChange)
    this.#specField.addEventListener('keyup', onSpecificationChange)
    onDoubleClick(this.#diagramContainer, () => {
      this.#eventTarget!.onScaleModeToggleRequested()
    })
    this.#themeToggleButton.addEventListener('click', () => {
      this.#eventTarget!.onThemeToggleRequested()
    })
    this.#saveSpecButton.addEventListener('click', () => {
      closeSubmenu()
      this.#eventTarget!.onSpecificationExportRequested()
    })
    this.#saveSvgButton.addEventListener('click', () => {
      closeSubmenu()
      this.#eventTarget!.onSvgExportRequested()
    })
    this.#savePngButton.addEventListener('click', () => {
      closeSubmenu()
      this.#eventTarget!.onPngExportRequested()
    })
  }

  #setControlsEnabled (enabled: boolean) {
    this.#saveSvgButton.disabled = !enabled
    this.#savePngButton.disabled = !enabled
  }
}
