import fs from 'node:fs/promises'
import path from 'node:path'

import { parseMarbleDiagramSpecification } from '@swirly/parser'
import { DiagramSpecification } from '@swirly/types'
import YAML from 'js-yaml'

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
