const { TestScheduler } = require('rxjs/testing')
const { firstNonNull } = require('./util/first-non-null')

const SCALE = 1 / 10
const DURATION_OFFSET = 1
const STYLES_HEADER = '[styles]'

const isNumeric = str => /^[-+]?(?:\d+|\d*(?:\.\d+))$/.test(str)

const getDuration = messages => {
  let maxFrame = 0

  const walk = (messages, delta) => {
    for (const {
      frame,
      notification: { value }
    } of messages) {
      const frameAbs = delta + frame
      if (Array.isArray(value)) {
        walk(value, frameAbs)
      } else if (frameAbs > maxFrame) {
        maxFrame = frameAbs
      }
    }
  }

  walk(messages, 0)

  return maxFrame + DURATION_OFFSET
}

const toSpec = (messagesIn, title = null) => {
  const messagesOut = messagesIn.map(
    ({ frame, notification: { kind, value } }) => ({
      frame: frame * SCALE,
      notification: {
        value: Array.isArray(value) ? toSpec(value) : value,
        kind
      }
    })
  )

  return {
    title,
    duration: getDuration(messagesOut),
    messages: messagesOut
  }
}

const removeCr = str =>
  str.endsWith('\r') ? str.substring(0, str.length - 1) : str

function * byLine (str) {
  let prevIdx = -1
  let idx = str.indexOf('\n')

  while (idx >= 0) {
    yield removeCr(str.substring(prevIdx + 1, idx))
    prevIdx = idx
    idx = str.indexOf('\n', idx + 1)
  }

  if (prevIdx >= 0) {
    yield removeCr(str.substring(prevIdx + 1))
  }
}

function * byBlock (str) {
  const acc = []

  for (const line of byLine(str)) {
    if (/^\s*%/.test(line)) {
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

const parseMarbleDiagramSpec = str => {
  const streams = []
  const styles = {}

  const allValues = {}

  for (const lines of byBlock(str)) {
    if (lines[0] === STYLES_HEADER) {
      const extraStyles = parseConfig(lines.slice(1), false)
      Object.assign(styles, extraStyles)
    } else if (lines.length === 1) {
      // HACK Operator is a "stream" with messages == null
      streams.push({
        title: lines[0]
      })
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
        streams.push(spec)
      }
    }
  }

  return { styles, streams }
}

module.exports = {
  parseMarbleDiagramSpec
}
