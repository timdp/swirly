export const buildDataUri = (mimeType: string, data: string) =>
  'data:' + mimeType + ',' + encodeURI(data)
