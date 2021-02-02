#!/usr/bin/env node

import 'source-map-support/register'
import 'hard-rejection/register'

import { EOL } from 'os'
import yargs from 'yargs'

import { RasterizationServer } from './index'

const getOpts = (): { port: number; address: string } => {
  const argv = yargs
    .option('p', {
      type: 'number',
      alias: 'port',
      description: 'Port (0 means auto)',
      default: 0
    })
    .option('a', {
      type: 'string',
      alias: 'address',
      description: 'Address',
      default: '0.0.0.0'
    })
    .strict()
    .parse()
  const port = argv.port as number
  const address = argv.address as string
  return { port, address }
}

const startServer = async (
  port: number,
  address: string
): Promise<RasterizationServer> => {
  const server = new RasterizationServer(port, address)
  await server.start()
  return server
}

const listenForKillSignals = (server: RasterizationServer) => {
  const stopServerAndExit = () => {
    process.removeListener('SIGINT', stopServerAndExit)
    process.removeListener('SIGTERM', stopServerAndExit)
    // Fire-and-forget, relying on hard-rejection
    server.stop()
  }
  process.on('SIGINT', stopServerAndExit)
  process.on('SIGTERM', stopServerAndExit)
}

const main = async () => {
  const { port, address } = getOpts()
  const server = await startServer(port, address)
  listenForKillSignals(server)
  process.stdout.write(server.url)
  process.stdout.write(EOL)
}

main()
