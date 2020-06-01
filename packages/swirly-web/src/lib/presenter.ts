import { parseMarbleDiagramSpec } from 'swirly-parser'
import { renderMarbleDiagram } from 'swirly-renderer'
import { styles as darkStyles } from 'swirly-theme-default-dark'
import { styles as lightStyles } from 'swirly-theme-default-light'

import { download } from './download'
import { Model } from './model'
import { StateRepository } from './state'
import { IEventTarget } from './types'
import { View } from './view'

declare const VERSION: string

export class Presenter implements IEventTarget {
  private _model: Model
  private _view: View
  private _stateRepository: StateRepository

  constructor (model: Model, view: View, stateRepository: StateRepository) {
    this._model = model
    this._view = view
    this._stateRepository = stateRepository
  }

  start () {
    this._view.init(VERSION, this, this._model.code)
    this._render()
  }

  onSpecificationChange (code: string) {
    this._model.code = code
    this._modelUpdated()
    this._render()
  }

  onThemeToggleRequested () {
    this._model.darkThemeEnabled = !this._model.darkThemeEnabled
    this._modelUpdated()
    this._render()
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

  onSvgExportRequested () {
    download(this._getSvgDataUri(), 'diagram.svg')
  }

  onScaleModeToggleRequested () {
    this._model.scaleMode = this._model.scaleMode === 'fit' ? 'none' : 'fit'
    this._modelUpdated()
    this._view.setScaleMode(this._model.scaleMode)
  }

  _render () {
    this._view.setDarkThemeEnabled(this._model.darkThemeEnabled)
    const styles = this._model.darkThemeEnabled ? darkStyles : lightStyles
    try {
      const spec = parseMarbleDiagramSpec(this._model.code)
      const renderResult = renderMarbleDiagram(spec, { styles })
      const svgElement = (renderResult.document
        .documentElement as unknown) as SVGElement
      this._view.setScaleMode(this._model.scaleMode)
      this._view.setResult(svgElement)
    } catch (err) {
      this._view.setError(err.stack)
    }
  }

  _modelUpdated () {
    this._stateRepository.write(this._model)
  }

  _getSvgDataUri (): string {
    const svgXml = this._view.getResultHtml()
    return 'data:image/svg+xml,' + encodeURI(svgXml)
  }
}
