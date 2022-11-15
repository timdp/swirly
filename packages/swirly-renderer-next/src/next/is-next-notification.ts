import {
  NextNotificationSpecification,
  NotificationSpecification
} from '@swirly/types'

export function isNextNotification (
  notification: NotificationSpecification
): notification is NextNotificationSpecification {
  return notification.kind === 'N'
}
