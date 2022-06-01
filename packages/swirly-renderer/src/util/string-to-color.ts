// @ts-ignore
import { sync as sha1 } from 'simple-sha1'

import { hexToDec } from './hex-to-dec'

export const stringToColor = (str: string, mode: 'light' | 'dark'): string => {
  const hashHex = sha1(str)
  const hash = hexToDec(hashHex.substring(4, 8))
  const hue = Math.round((hash / (1 << 16)) * 360)
  const saturation = 60
  const lightness = mode === 'dark' ? 20 : 80
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
