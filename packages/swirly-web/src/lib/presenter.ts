import { parseMarbleDiagramSpecification } from '@swirly/parser'
import { renderMarbleDiagram } from '@swirly/renderer'
import { darkStyles } from '@swirly/theme-default-dark'
import { lightStyles } from '@swirly/theme-default-light'
import dedent from 'dedent'

import { examples } from './examples.js'
import { Model } from './model.js'
import { StateRepository } from './state.js'
import { Example, IEventTarget } from './types.js'
import { buildDataUri } from './util/data-uri.js'
import { download } from './util/download.js'
import { View } from './view.js'

declare const VERSION: string

export class Presenter implements IEventTarget {
  static readonly DEFAULT_CODE =
    dedent(`
      % An example application of the concatAll operator.
      % Edit this code to redraw the diagram in real time.
    `) +
    '\n\n' +
    examples[0].code

  #model: Model
  #view: View
  #stateRepository: StateRepository

  constructor (model: Model, view: View, stateRepository: StateRepository) {
    this.#model = model
    this.#view = view
    this.#stateRepository = stateRepository
  }

  start () {
    if (this.#model.code === '') {
      this.#model.code = Presenter.DEFAULT_CODE
    }
    const { code, darkThemeEnabled, scaleMode } = this.#model
    this.#view.init(this, VERSION, code, darkThemeEnabled, scaleMode, examples)
    this.#render()
  }

  onSpecificationChange (code: string) {
    if (code === this.#model.code) {
      return
    }
    this.#model.code = code
    this.#modelUpdated()
    this.#render()
  }

  onThemeToggleRequested () {
    this.#model.darkThemeEnabled = !this.#model.darkThemeEnabled
    this.#modelUpdated()
    this.#view.setDarkThemeEnabled(this.#model.darkThemeEnabled)
    this.#render()
  }

  onScaleModeToggleRequested () {
    this.#model.scaleMode = this.#model.scaleMode === 'fit' ? 'none' : 'fit'
    this.#modelUpdated()
    this.#view.setScaleMode(this.#model.scaleMode)
  }

  onSpecificationExportRequested () {
    download(this.#getSpecDataUri(), 'diagram.txt')
  }

  onSvgExportRequested () {
    download(this.#getSvgDataUri(), 'diagram.svg')
  }

  onPngExportRequested () {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')!
      context.drawImage(image, 0, 0)
      download(canvas.toDataURL('image/png'), 'diagram.png')
    }
    image.src = this.#getSvgDataUri()
  }

  onExampleRequested (example: Example) {
    window.open('#code=' + encodeURIComponent(example.code), '_blank')
  }

  #render () {
    const { code, darkThemeEnabled } = this.#model
    const styles = darkThemeEnabled ? darkStyles : lightStyles

    let spec
    try {
      spec = parseMarbleDiagramSpecification(code)
    } catch (err) {
      this.#view.setRenderErrorMessage(
        'Failed to parse: ' + (err as Error).stack
      )
      return
    }

    let result
    try {
      result = renderMarbleDiagram(spec, { styles })
    } catch (err) {
      this.#view.setRenderErrorMessage(
        'Failed to render: ' + (err as Error).stack
      )
      return
    }

    this.#view.setDiagramRendering(result.document.documentElement)
  }

  #modelUpdated () {
    this.#stateRepository.write(this.#model)
  }

  #getSpecDataUri (): string {
    return buildDataUri('text/plain', 'utf-8', this.#model.code)
  }

  #getSvgDataUri (): string {
    return buildDataUri('image/svg+xml', 'utf-8', this.#view.getDiagramSvgXml())
  }
}
