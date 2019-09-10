const mergeStyles = (prefix, globalStyles, localStyles) => {
  const result = {}
  const keys = Object.keys(globalStyles).filter(key => key.startsWith(prefix))
  for (const fullKey of keys) {
    const key = fullKey.substr(prefix.length)
    result[key] =
      localStyles[key] != null ? localStyles[key] : globalStyles[fullKey]
  }
  return result
}

module.exports = {
  mergeStyles
}
