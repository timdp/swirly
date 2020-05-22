import { OperatorSpecification } from './operator'
import { StreamSpecification } from './stream'
import { DiagramStyles } from './styles'

export type DiagramSpecification = {
  content: (StreamSpecification | OperatorSpecification)[]
  styles?: DiagramStyles
}
