export const invertObject = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]))
