import {
  NextNotificationSpecification,
  StreamNextNotificationSpecification
} from '@swirly/types'

export function isObservableNextNotification (
  notification: NextNotificationSpecification
): notification is StreamNextNotificationSpecification {
  return typeof notification.value === 'object'
}
