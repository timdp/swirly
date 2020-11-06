import { OperatorSpecification } from './operator'
import { StreamSpecification } from './stream'
import { DiagramStyles } from './styles'

export type DiagramContent = (StreamSpecification | OperatorSpecification)[]

export type DiagramSpecification = {
  content: DiagramContent
  styles?: DiagramStyles
}
