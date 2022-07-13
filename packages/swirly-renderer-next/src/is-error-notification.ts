import {
  ErrorNotificationSpecification,
  NotificationSpecification
} from '@swirly/types'

export function isErrorNotification (
  notification: NotificationSpecification
): notification is ErrorNotificationSpecification {
  return notification.kind === 'E'
}
