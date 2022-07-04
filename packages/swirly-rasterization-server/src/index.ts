import { InkscapeRasterizer } from '@swirly/rasterizer-inkscape'
import { PuppeteerRasterizer } from '@swirly/rasterizer-puppeteer'
import {
  IRasterizer,
  RasterizationRequest,
  RasterizerName
} from '@swirly/types'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import pMemoize from 'p-memoize'

// eslint-disable-next-line no-unused-vars
const rasterizerImpls: Record<RasterizerName, { new (): IRasterizer }> = {
  puppeteer: PuppeteerRasterizer,
  inkscape: InkscapeRasterizer
}

export class RasterizationServer {
  static readonly RASTERIZER_NAMES = Object.keys(rasterizerImpls)

  #port: number
  #address: string
  #rasterizers: Map<RasterizerName, IRasterizer>
  #createRasterizerOnce: (name: RasterizerName) => Promise<IRasterizer>
  #fastify: FastifyInstance

  constructor (port: number = 0, address: string | null = null) {
    this.#port = port
    this.#address = address != null ? address : '0.0.0.0'
    this.#rasterizers = new Map<RasterizerName, IRasterizer>()
    this.#createRasterizerOnce = pMemoize(this.#createRasterizer.bind(this))
    this.#fastify = fastify()
    this.#registerRoutes()
  }

  get url (): string {
    const { address, port } = this.#fastify.server.address() as {
      address: string
      port: number
    }
    return `http://${address}:${port}`
  }

  async start (): Promise<void> {
    await this.#fastify.listen({
      host: this.#address,
      port: this.#port
    })
  }

  async stop (): Promise<void> {
    await this.#fastify.close()
    const rasterizers = Array.from(this.#rasterizers.values())
    await Promise.all(
      rasterizers.map(async (rasterizer) => {
        await rasterizer.dispose()
      })
    )
  }

  #registerRoutes () {
    this.#fastify.get('/', () => ({}))
    this.#fastify.post(
      '/rasterize',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { rasterizer, svgXml, width, height, format } =
          request.body as RasterizationRequest
        const rasterizerImpl = await this.#createRasterizerOnce(rasterizer)
        const output = await rasterizerImpl.rasterize(
          svgXml,
          width,
          height,
          format
        )
        reply.header('content-type', `image/${format}`)
        return output
      }
    )
  }

  async #createRasterizer (name: RasterizerName): Promise<IRasterizer> {
    const RasterizerImpl = rasterizerImpls[name]
    const rasterizer: IRasterizer = new RasterizerImpl()
    await rasterizer.init()
    this.#rasterizers.set(name, rasterizer)
    return rasterizer
  }
}
