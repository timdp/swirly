const { TestScheduler } = require('rxjs/testing')
const { firstNonNull } = require('./util/first-non-null')

const SCALE = 1 / 10
const STYLES_HEADER = '[styles]'
const OPERATOR_PREFIX = '>'

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

  return maxFrame
}

const toStreamSpec = (messagesIn, title = null) => {
  const messagesOut = messagesIn.map(
    ({ frame, notification: { kind, value } }) => ({
      frame: frame * SCALE,
      notification: {
        value: Array.isArray(value) ? toStreamSpec(value) : value,
        kind
      }
    })
  )

  return {
    kind: 'S',
    title,
    duration: getDuration(messagesOut),
    messages: messagesOut
  }
}

const toOperatorSpec = title => ({
  kind: 'O',
  title
})

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

  const re = /([A-Za-z0-9])/g
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

const parseNameAndMarbles = nameAndMarbles => {
  const match = /^([A-Za-z0-9])\s*=\s*(\S+)\s*$/.exec(nameAndMarbles)
  if (match != null) {
    const [, name, marbles] = match
    return [name, marbles]
  }
  return [null, nameAndMarbles]
}

const parseMarbleDiagramSpec = str => {
  const content = []
  const styles = {}

  const allValues = {}

  for (const lines of byBlock(str)) {
    if (lines[0] === STYLES_HEADER) {
      const extraStyles = parseConfig(lines.slice(1), false)
      Object.assign(styles, extraStyles)
    } else if (lines[0].startsWith(OPERATOR_PREFIX)) {
      const spec = toOperatorSpec(
        lines[0].substring(OPERATOR_PREFIX.length).trim()
      )
      content.push(spec)
    } else {
      const [nameAndMarbles, ...configLines] = lines
      const [name, marbles] = parseNameAndMarbles(nameAndMarbles)
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

      if (name == null) {
        const spec = toStreamSpec(messages, config.title)
        content.push(spec)
      }
    }
  }

  return { styles, content }
}

module.exports = {
  parseMarbleDiagramSpec
}
