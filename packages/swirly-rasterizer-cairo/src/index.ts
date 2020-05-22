import { fabric } from 'fabric'
import { Readable } from 'stream'
import streamToPromise from 'stream-to-promise'
import { RasterizerOutputFormat } from 'swirly-types'

// XXX Typings for fabric are incomplete

interface RasterizingStaticCanvas extends fabric.StaticCanvas {
  createJPEGStream(): Readable
  createPNGStream(): Readable
}

const loadSvg = (svgXml: string): Promise<fabric.Object> =>
  new Promise(resolve => {
    fabric.loadSVGFromString(svgXml, (objects, options) => {
      resolve(fabric.util.groupSVGElements(objects, options))
    })
  })

export const rasterizeSvg = async (
  svgXml: string,
  width: number,
  height: number,
  format: RasterizerOutputFormat
): Promise<Buffer> => {
  // @ts-ignore
  const canvas: RasterizingStaticCanvas = new fabric.StaticCanvas(null, {
    width,
    height
  })
  const group = await loadSvg(svgXml)
  group.scaleToWidth(width)
  canvas.add(group)
  canvas.renderAll()
  const stream =
    format === 'jpeg' ? canvas.createJPEGStream() : canvas.createPNGStream()
  const data = await streamToPromise(stream)
  return data
}
