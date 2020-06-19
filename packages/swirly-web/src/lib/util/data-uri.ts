export const buildDataUri = (
  contentType: string,
  charset: string,
  data: string
) => `data:${contentType};charset=${charset};base64,${encodeURI(btoa(data))}`
