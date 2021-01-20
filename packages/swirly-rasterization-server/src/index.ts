import { rasterizeSvg as inkscape } from '@swirly/rasterizer-inkscape'
import { rasterizeSvg as puppeteer } from '@swirly/rasterizer-puppeteer'
import { RasterizationRequest, Rasterizer, RasterizerName } from '@swirly/types'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

const rasterizers: {
  [N in RasterizerName]: Rasterizer
} = {
  inkscape,
  puppeteer
}

export class RasterizationServer {
  static readonly RASTERIZER_NAMES = Object.keys(
    rasterizers
  ) as RasterizerName[]

  private _port: number

  private _address: string

  private _fastify?: FastifyInstance

  constructor (port: number = 0, address: string | null = null) {
    this._port = port
    this._address = address != null ? address : '0.0.0.0'
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
        const rasterizeSvg: Rasterizer = rasterizers[rasterizer]
        const output = await rasterizeSvg(svgXml, width, height, format)
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
}
