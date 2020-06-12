import 'core-js/stable'

import { Model } from './lib/model'
import { Presenter } from './lib/presenter'
import { StateRepository } from './lib/state'
import { maintainFullHeight } from './lib/util/full-height'
import { View } from './lib/view'

maintainFullHeight()

const stateRepository = new StateRepository()
const model = stateRepository.read() || new Model()
const view = new View()
const presenter = new Presenter(model, view, stateRepository)
presenter.start()
