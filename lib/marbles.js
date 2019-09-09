const { TestScheduler } = require('rxjs/testing')
const { EOL } = require('os')

const SCALE = 1 / 10
const DURATION_OFFSET = 1

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

const parseMarbles = str => {
  const allValues = {}
  const observables = []

  for (const [name, marbles, ...config] of byBlock(str)) {
    const localValues = {}
    for (const name of extractNames(marbles)) {
      localValues[name] = allValues[name] != null ? allValues[name] : name
    }

    const messages = TestScheduler.parseMarbles(marbles, localValues)
    allValues[name] = messages

    if (!config.includes('hidden')) {
      const spec = toSpec(messages, name)
      observables.push(spec)
    }
  }

  return { observables }
}

module.exports = {
  parseMarbles
}
