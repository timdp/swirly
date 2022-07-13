import {
  CompletionNotificationSpecification,
  NotificationSpecification
} from '@swirly/types'

export function isCompleteNotification (
  notification: NotificationSpecification
): notification is CompletionNotificationSpecification {
  return notification.kind === 'C'
}
