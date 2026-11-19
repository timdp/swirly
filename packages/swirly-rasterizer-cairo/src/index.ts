import { Readable } from 'node:stream'
import { buffer } from 'node:stream/consumers'

import { IRasterizer, RasterizerOutputFormat } from '@swirly/types'
import {
  FabricObject,
  loadSVGFromString,
  StaticCanvas,
  util,
} from 'fabric/node'

// XXX Typings for fabric are incomplete

interface RasterizingStaticCanvas extends StaticCanvas {
  createJPEGStream(): Readable;
}

const loadSvg = async (svgXml: string): Promise<FabricObject> => {
  const { objects, options } = await loadSVGFromString(svgXml)
  return util.groupSVGElements(
    objects.filter((object): object is FabricObject => object !== null),
    options
  )
}

export class CairoRasterizer implements IRasterizer {
  async init (): Promise<void> {}

  async dispose (): Promise<void> {}

  async rasterize (
    svgXml: string,
    width: number,
    height: number,
    format: RasterizerOutputFormat
  ): Promise<Buffer> {
    const canvas = new StaticCanvas(undefined, {
      width,
      height,
    }) as RasterizingStaticCanvas
    const group = await loadSvg(svgXml)
    group.scaleToWidth(width)
    canvas.add(group)
    canvas.renderAll()
    const stream =
      format === 'jpeg' ? canvas.createJPEGStream() : canvas.createPNGStream()
    const data = await buffer(stream)
    return data
  }
}
