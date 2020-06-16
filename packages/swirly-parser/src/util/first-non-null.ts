export const firstNonNull = <T>(...candidates: readonly T[]): T | null => {
  for (const candidate of candidates) {
    if (candidate != null) {
      return candidate
    }
  }
  return null
}
