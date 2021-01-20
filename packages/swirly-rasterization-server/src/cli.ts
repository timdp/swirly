#!/usr/bin/env node

import 'source-map-support/register'
import 'hard-rejection/register'

import yargs from 'yargs'

import { RasterizationServer } from './index'

const main = async () => {
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
  const server = new RasterizationServer(port, address)
  await server.start()
  console.log(server.url)
}

main()
