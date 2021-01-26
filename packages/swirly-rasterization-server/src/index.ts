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
const rasterizerImpls: { [N in RasterizerName]: { new (): IRasterizer } } = {
  puppeteer: PuppeteerRasterizer,
  inkscape: InkscapeRasterizer
}

export class RasterizationServer {
  static readonly RASTERIZER_NAMES = Object.keys(
    rasterizerImpls
  ) as RasterizerName[]

  private _port: number

  private _address: string

  private _fastify?: FastifyInstance

  private _rasterizers: Map<RasterizerName, IRasterizer>

  constructor (port: number = 0, address: string | null = null) {
    this._port = port
    this._address = address != null ? address : '0.0.0.0'
    this._rasterizers = new Map<RasterizerName, IRasterizer>()
    this._createRasterizer = pMemoize(this._createRasterizer.bind(this), {
      cachePromiseRejection: true
    })
  }

  get url (): string {
    const { address, port } = this._fastify!.server.address() as {
      address: string
      port: number
    }
    return `http://${address}:${port}`
  }

  async start (): Promise<void> {
    this._fastify = fastify()
    this._registerRoutes()
    await this._listen()
  }

  async stop (): Promise<void> {
    await this._fastify!.close()
    const rasterizers = Array.from(this._rasterizers.values())
    await Promise.all(
      rasterizers.map(async rasterizer => {
        await rasterizer.dispose()
      })
    )
  }

  _registerRoutes () {
    this._fastify!.get('/', (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({})
    })
    this._fastify!.post(
      '/rasterize',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const {
          rasterizer,
          svgXml,
          width,
          height,
          format
        } = request.body as RasterizationRequest
        const rasterizerImpl: IRasterizer = await this._createRasterizer(
          rasterizer
        )
        const output = await rasterizerImpl.rasterize(
          svgXml,
          width,
          height,
          format
        )
        reply.header('content-type', 'application/octet-stream')
        return output
      }
    )
  }

  _listen (): Promise<void> {
    return new Promise((resolve, reject) => {
      this._fastify!.listen(
        this._port,
        this._address,
        (err: Error, address: string) => {
          if (err != null) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  async _createRasterizer (name: RasterizerName): Promise<IRasterizer> {
    const RasterizerImpl = rasterizerImpls[name]
    const rasterizer: IRasterizer = new RasterizerImpl()
    await rasterizer.init()
    this._rasterizers.set(name, rasterizer)
    return rasterizer
  }
}
