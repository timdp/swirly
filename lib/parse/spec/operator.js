const { ItemKind } = require('../../util/item-kind')

const toOperatorSpec = title => ({
  kind: ItemKind.OPERATOR,
  title
})

module.exports = { toOperatorSpec }
