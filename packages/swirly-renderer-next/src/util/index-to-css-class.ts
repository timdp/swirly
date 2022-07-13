const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function indexToCssClass (value: number): string {
  let result = ''

  for (; value >= 0; value = Math.floor(value / chars.length) - 1) {
    result = chars[value % chars.length] + result
  }

  return result
}
