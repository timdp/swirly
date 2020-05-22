import {
  CompletionNotificationSpecification,
  ErrorNotificationSpecification,
  NotificationSpecification,
  ScalarNextNotificationSpecification,
  StreamNextNotificationSpecification
} from './notification'
import {
  CompletionMessageStyles,
  ErrorMessageStyles,
  ScalarNextMessageStyles,
  StreamNextMessageStyles
} from './styles'

type BaseMessageSpecification = {
  frame: number
  notification: NotificationSpecification
}

export type ScalarNextMessageSpecification = BaseMessageSpecification & {
  notification: ScalarNextNotificationSpecification
  styles?: ScalarNextMessageStyles
}

export type StreamNextMessageSpecification = BaseMessageSpecification & {
  notification: StreamNextNotificationSpecification
  styles?: StreamNextMessageStyles
}

export type NextMessageSpecification =
  | ScalarNextMessageSpecification
  | StreamNextMessageSpecification

export type CompletionMessageSpecification = BaseMessageSpecification & {
  notification: CompletionNotificationSpecification
  styles?: CompletionMessageStyles
}

export type ErrorMessageSpecification = BaseMessageSpecification & {
  notification: ErrorNotificationSpecification
  styles?: ErrorMessageStyles
}

export type MessageSpecification =
  | NextMessageSpecification
  | CompletionMessageSpecification
  | ErrorMessageSpecification
