export const download = (dataUri: string, name: string) => {
  const a = document.createElement('a')
  a.href = dataUri
  a.target = '_blank'
  a.download = name
  a.click()
}
