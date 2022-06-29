import { OperatorSpecification } from './operator.js'
import { StreamSpecification } from './stream.js'
import { DiagramStyles } from './styles.js'

export type DiagramContent = (StreamSpecification | OperatorSpecification)[]

export type DiagramSpecification = {
  content: DiagramContent
  styles?: DiagramStyles
}
