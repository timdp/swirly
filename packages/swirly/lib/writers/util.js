const fs = require('fs')

const createWriteStreamFactory = encoding => (file, force) =>
  fs.createWriteStream(file, {
    flags: force ? 'w' : 'wx',
    encoding
  })

const defaultFormatOutput = async xml => xml

module.exports = {
  createWriteStreamFactory,
  defaultFormatOutput
}
