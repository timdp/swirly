import { Model } from './model'

export class StateRepository {
  read (): Model | null {
    let state
    try {
      state = JSON.parse(window.localStorage.state)
    } catch (_) {}

    if (state == null || typeof state !== 'object') {
      return null
    }

    const model = new Model()

    if (typeof state.code === 'string') {
      model.code = state.code
    }

    model.darkThemeEnabled = !!state.darkThemeEnabled

    if (typeof state.scaleMode === 'string') {
      model.scaleMode = state.scaleMode
    }

    return model
  }

  write (model: Model) {
    try {
      window.localStorage.state = JSON.stringify(model.toJSON())
    } catch (_) {}
  }
}
