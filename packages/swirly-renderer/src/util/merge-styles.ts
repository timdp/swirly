import { FreeformStyles } from 'swirly-types'

export const mergeStyles = (
  globalStyles: FreeformStyles,
  localStyles: FreeformStyles | null | undefined,
  globalPrefix: string,
  localStylesPrefixed: boolean = false
): FreeformStyles => {
  const result: FreeformStyles = {}

  const globalKeys = Object.keys(globalStyles).filter(key =>
    key.startsWith(globalPrefix)
  )
  for (const globalKey of globalKeys) {
    const simpleKey = globalKey.substr(globalPrefix.length)
    const localKey = localStylesPrefixed ? globalKey : simpleKey
    result[simpleKey] =
      localStyles != null && localStyles[localKey] != null
        ? localStyles[localKey]
        : globalStyles[globalKey]
  }

  return result
}
