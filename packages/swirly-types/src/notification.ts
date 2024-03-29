import { StreamSpecification } from './stream.js'

export type ScalarNextNotificationSpecification = {
  kind: 'N'
  value: string
}

export type StreamNextNotificationSpecification = {
  kind: 'N'
  value: StreamSpecification
  isGhost: boolean
}

export type NextNotificationSpecification =
  | ScalarNextNotificationSpecification
  | StreamNextNotificationSpecification

export type CompletionNotificationSpecification = {
  kind: 'C'
}

export type ErrorNotificationSpecification = {
  kind: 'E'
}

export type NotificationSpecification =
  | NextNotificationSpecification
  | CompletionNotificationSpecification
  | ErrorNotificationSpecification
