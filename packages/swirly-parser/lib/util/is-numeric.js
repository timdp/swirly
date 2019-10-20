const re = /^[-+]?(?:\d+|\d*(?:\.\d+))$/

const isNumeric = str => re.test(str)

module.exports = { isNumeric }
