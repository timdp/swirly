import { Readable } from 'node:stream'

import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import { fabric } from 'fabric'
import streamToPromise from 'stream-to-promise'

// XXX Typings for fabric are incomplete

interface RasterizingStaticCanvas extends fabric.StaticCanvas {
  createJPEGStream(): Readable
  createPNGStream(): Readable
}

const loadSvg = (svgXml: string): Promise<fabric.Object> =>
  new Promise((resolve) => {
    fabric.loadSVGFromString(svgXml, (objects, options) => {
      resolve(fabric.util.groupSVGElements(objects, options))
    })
  })

export class CairoRasterizer implements IRasterizer {
  async init (): Promise<void> {}

  async dispose (): Promise<void> {}

  async rasterize (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const canvas = new fabric.StaticCanvas(null, {
      width,
      height
    }) as RasterizingStaticCanvas
    const group = await loadSvg(svgXml)
    group.scaleToWidth(width)
    canvas.add(group)
    canvas.renderAll()
    const stream =
      format === 'jpeg' ? canvas.createJPEGStream() : canvas.createPNGStream()
    const data = await streamToPromise(stream)
    return data
  }
}
