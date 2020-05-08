const { styles: baseStyles } = require('swirly-theme-default-base')
const ourStyles = require('./styles.json')

module.exports = {
  styles: {
    ...baseStyles,
    ...ourStyles
  }
}
