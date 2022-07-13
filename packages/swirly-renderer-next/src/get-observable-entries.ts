import { NotificationSpecification, StreamSpecification } from '@swirly/types'

import { isNextNotification } from './next/is-next-notification'

export function * getObservableEntries (
  observable: StreamSpecification
): Iterable<
  readonly [
    frame: number,
    floor: number,
    notification: NotificationSpecification
  ]
> {
  const framesFloor = new Map<number, number>()

  for (const { frame, notification } of observable.messages) {
    if (isNextNotification(notification)) {
      continue
    }

    yield [frame, 0, notification]
  }

  for (const { frame, notification } of observable.messages) {
    if (!isNextNotification(notification)) {
      continue
    }

    const floor = framesFloor.get(frame) ?? 0

    framesFloor.set(frame, floor + 1)

    yield [frame, floor, notification]
  }
}
