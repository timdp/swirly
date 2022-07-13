import { join } from './join'
import { splitCamelCase } from './split-camel-case'

export function camelCaseToDashCase (value: string): string {
  return join(splitCamelCase(value), '-')
}
