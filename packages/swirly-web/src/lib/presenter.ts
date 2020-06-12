import dedent from 'dedent'
import { parseMarbleDiagramSpec } from 'swirly-parser'
import { renderMarbleDiagram } from 'swirly-renderer'
import { styles as darkStyles } from 'swirly-theme-default-dark'
import { styles as lightStyles } from 'swirly-theme-default-light'

import { examples } from './examples'
import { Model } from './model'
import { StateRepository } from './state'
import { Example, IEventTarget } from './types'
import { download } from './util/download'
import { View } from './view'

declare const VERSION: string

export class Presenter implements IEventTarget {
  static readonly DEFAULT_CODE =
    dedent(`
    % An example application of the concatAll operator.
    % Edit this code to redraw the diagram in real time.
  `) +
    '\n\n' +
    examples[0].code

  private _model: Model
  private _view: View
  private _stateRepository: StateRepository

  constructor (model: Model, view: View, stateRepository: StateRepository) {
    this._model = model
    this._view = view
    this._stateRepository = stateRepository
  }

  start () {
    if (this._model.code === '') {
      this._model.code = Presenter.DEFAULT_CODE
    }
    const { code, darkThemeEnabled, scaleMode } = this._model
    this._view.init(this, VERSION, code, darkThemeEnabled, scaleMode, examples)
    this._render()
  }

  onSpecificationChange (code: string) {
    if (code === this._model.code) {
      return
    }
    this._model.code = code
    this._modelUpdated()
    this._render()
  }

  onThemeToggleRequested () {
    this._model.darkThemeEnabled = !this._model.darkThemeEnabled
    this._modelUpdated()
    this._view.setDarkThemeEnabled(this._model.darkThemeEnabled)
    this._render()
  }

  onScaleModeToggleRequested () {
    this._model.scaleMode = this._model.scaleMode === 'fit' ? 'none' : 'fit'
    this._modelUpdated()
    this._view.setScaleMode(this._model.scaleMode)
  }

  onSpecificationExportRequested () {
    download(this._getSpecDataUri(), 'diagram.txt')
  }

  onSvgExportRequested () {
    download(this._getSvgDataUri(), 'diagram.svg')
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
    image.src = this._getSvgDataUri()
  }

  onExampleRequested (example: Example) {
    // TODO Open in new window instead
    this._view.setDiagramSpecification(example.code)
  }

  _render () {
    const { code, darkThemeEnabled } = this._model
    const styles = darkThemeEnabled ? darkStyles : lightStyles

    let spec
    try {
      spec = parseMarbleDiagramSpec(code)
    } catch (err) {
      this._view.setRenderErrorMessage('Failed to parse: ' + err.stack)
      return
    }

    let result
    try {
      result = renderMarbleDiagram(spec, { styles })
    } catch (err) {
      this._view.setRenderErrorMessage('Failed to render: ' + err.stack)
      return
    }

    const svg = (result.document.documentElement as unknown) as SVGSVGElement
    this._view.setDiagramRendering(svg)
  }

  _modelUpdated () {
    this._stateRepository.write(this._model)
  }

  _getSpecDataUri (): string {
    const { code } = this._model
    return 'data:text/plain,' + encodeURI(code)
  }

  _getSvgDataUri (): string {
    const svgXml = this._view.getDiagramSvgXml()
    return 'data:image/svg+xml,' + encodeURI(svgXml)
  }
}
