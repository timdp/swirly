const { toOperatorSpec } = require('../spec/operator')
const { OPERATOR_PREFIX } = require('../constants')

const match = line => line.startsWith(OPERATOR_PREFIX)

const run = (lines, { content }) => {
  const title = lines[0].substring(OPERATOR_PREFIX.length).trim()
  const spec = toOperatorSpec(title)
  content.push(spec)
}

const operatorParser = {
  match,
  run
}

module.exports = { operatorParser }
