export const invertObject = (o: Record<string, any>): Record<string, string> =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]))
