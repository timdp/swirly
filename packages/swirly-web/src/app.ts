import 'core-js/stable'

import { maintainFullHeight } from './lib/height'
import { Model } from './lib/model'
import { Presenter } from './lib/presenter'
import { StateRepository } from './lib/state'
import { View } from './lib/view'

maintainFullHeight()

const stateRepository = new StateRepository()
const model = stateRepository.read() || new Model()
const view = new View()
const presenter = new Presenter(model, view, stateRepository)
presenter.start()
