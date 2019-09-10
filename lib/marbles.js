const { TestScheduler } = require('rxjs/testing')
const { EOL } = require('os')
const { firstNonNull } = require('./util/first-non-null')

const SCALE = 1 / 10
const DURATION_OFFSET = 1
const STYLES_HEADER = '[styles]'

const isNumeric = str => /^[-+]?(?:\d+|\d*(?:\.\d+))$/.test(str)

const getDuration = notifications => {
  let maxFrame = 0

  const walk = (notifications, delta) => {
    for (const { frame, value } of notifications) {
      const frameAbs = delta + frame
      if (Array.isArray(value)) {
        walk(value, frameAbs)
      } else if (frameAbs > maxFrame) {
        maxFrame = frameAbs
      }
    }
  }

  walk(notifications, 0)

  return maxFrame + DURATION_OFFSET
}

const toSpec = (messages, title = null) => {
  const notifications = messages.map(
    ({ frame, notification: { kind, value } }) => ({
      frame: frame * SCALE,
      value: Array.isArray(value) ? toSpec(value) : value,
      kind
    })
  )

  return {
    title,
    duration: getDuration(notifications),
    notifications
  }
}

function * byLine (str) {
  let prevIdx = -1
  let idx = str.indexOf(EOL)

  while (idx >= 0) {
    yield str.substring(prevIdx + 1, idx)
    prevIdx = idx
    idx = str.indexOf(EOL, idx + 1)
  }
}

function * byBlock (str) {
  const acc = []

  for (const line of byLine(str)) {
    if (/^\s*#/.test(line)) {
      continue
    }

    if (line.trim() === '') {
      if (acc.length > 0) {
        yield acc.slice()
        acc.length = 0
      }
    } else {
      acc.push(line)
    }
  }

  if (acc.length > 0) {
    yield acc
  }
}

const extractNames = marbles => {
  const names = []

  const re = /([A-Za-z])/g
  let match
  while ((match = re.exec(marbles)) != null) {
    names.push(match[1])
  }

  return names
}

const parseValue = value => {
  if (value == null) {
    // 'hidden' is shorthand for 'hidden = true'
    return true
  }
  if (isNumeric(value)) {
    return parseFloat(value)
  }
  return value
}

const parseConfig = (lines, allowAssignment) => {
  const re = /^(.*?)(?:\s*(:?)=\s*(.*))?$/

  const config = {}
  if (allowAssignment) {
    config.values = {}
  }

  for (const line of lines) {
    const match = re.exec(line.trim())
    if (match != null) {
      const [, name, isAssignment, value] = match
      if (isAssignment) {
        config.values[name] = value
      } else {
        config[name] = parseValue(value)
      }
    }
  }

  return config
}

const parseMarbles = str => {
  const observables = []
  const styles = {}

  const allValues = {}

  for (const lines of byBlock(str)) {
    if (lines[0] === STYLES_HEADER) {
      const extraStyles = parseConfig(lines.slice(1), false)
      Object.assign(styles, extraStyles)
    } else {
      const [name, marbles, ...configLines] = lines
      const config = parseConfig(configLines, true)

      const localValues = {}
      for (const name of extractNames(marbles)) {
        localValues[name] = firstNonNull(
          config.values[name],
          allValues[name],
          name
        )
      }

      const messages = TestScheduler.parseMarbles(marbles, localValues)
      allValues[name] = messages

      if (!config.hidden) {
        const spec = toSpec(messages, name)
        observables.push(spec)
      }
    }
  }

  return { styles, observables }
}

module.exports = {
  parseMarbles
}