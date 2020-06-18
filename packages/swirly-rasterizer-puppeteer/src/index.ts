import { RasterizerOutputFormat } from '@swirly/types'

import { SvgScreenshotter } from './svg-screenshotter'

const safeDispose = async (screenshotter: SvgScreenshotter) => {
  try {
    await screenshotter.dispose()
  } catch (_) {}
}

const rasterizeSvg = async (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  const screenshotter = new SvgScreenshotter()
  try {
    await screenshotter.init()
  } catch (err) {
    throw new Error(`Failed to start browser: ${err}`)
  }

  let imageData: Buffer
  try {
    imageData = await screenshotter.capture(svgXml, width, height, format)
  } catch (err) {
    await safeDispose(screenshotter)
    throw new Error(`Failed to create screenshot: ${err}`)
  }

  try {
    await screenshotter.dispose()
  } catch (err) {
    throw new Error(`Failed to dispose browser: ${err}`)
  }

  return imageData
}

export { rasterizeSvg, SvgScreenshotter }
