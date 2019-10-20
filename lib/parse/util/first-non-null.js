const firstNonNull = (...candidates) => {
  for (const candidate of candidates) {
    if (candidate != null) {
      return candidate
    }
  }
  return null
}

module.exports = { firstNonNull }
