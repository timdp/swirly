export const download = (dataUri: string, name: string) => {
  const a = document.createElement('a')
  a.href = dataUri
  a.download = name
  a.click()
}
