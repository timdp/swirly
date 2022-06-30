import { parseMarbleDiagramSpecification } from '@swirly/parser'
import { DiagramSpecification } from '@swirly/types'
import YAML from 'js-yaml'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { YAML_EXTENSIONS } from './constants.js'

export const readDiagramSpec = async (
  inFilePath: string
): Promise<DiagramSpecification> => {
  const inFileContents: string = await fs.readFile(inFilePath, 'utf8')

  if (YAML_EXTENSIONS.includes(path.extname(inFilePath))) {
    return YAML.load(inFileContents) as DiagramSpecification
  }

  return parseMarbleDiagramSpecification(inFileContents)
}
