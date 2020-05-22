import { isNumeric } from '../util/is-numeric'

const reLine = /^(.*?)(?:\s*(:?)=\s*(.*))?$/

const parseValue = (value: string): string | number | boolean => {
  if (value == null) {
    return true
  }
  if (isNumeric(value)) {
    return parseFloat(value)
  }
  return value
}

export const parseConfig = (
  lines: string[],
  allowAssignment: boolean
): { [key: string]: any } => {
  const config: { [key: string]: any } = {}
  if (allowAssignment) {
    config.values = {}
  }

  for (const line of lines) {
    const match = reLine.exec(line.trim())
    if (match != null) {
      const [, name, isAssignment, value] = match
      if (isAssignment) {
        config.values[name] = value
      } else {
        config[name] = parseValue(value)
      }
    }
  }

  return config
}
