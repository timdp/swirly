const { stylesParser } = require('./styles')
const { operatorParser } = require('./operator')
const { streamParser } = require('./stream')

const parsers = [stylesParser, operatorParser, streamParser]

module.exports = { parsers }
