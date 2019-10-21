const { defaultFormatOutput } = require('./util')

const match = file => file == null

const formatOutput = defaultFormatOutput

const createWriteStream = () => process.stdout

const stdoutWriter = {
  match,
  formatOutput,
  createWriteStream
}

module.exports = { stdoutWriter }
