import 'core-js/stable'

import { Model } from './lib/model.js'
import { Presenter } from './lib/presenter.js'
import { StateRepository } from './lib/state.js'
import { maintainFullHeight } from './lib/util/full-height.js'
import { View } from './lib/view.js'

maintainFullHeight()

const stateRepository = new StateRepository()

const model = stateRepository.read() || new Model()

const paramsStr = window.location.hash.substring(1)
if (paramsStr !== '') {
  const params = new URLSearchParams(window.location.hash.substring(1))
  const code = params.get('code')
  if (code != null && code !== '') {
    model.code = code
    window.location.replace('#')
  }
}

const view = new View()

const presenter = new Presenter(model, view, stateRepository)
presenter.start()
