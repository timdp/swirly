import { TestMessage } from 'rxjs/internal/testing/TestMessage'
import { TestScheduler } from 'rxjs/testing'

const parseMarbles = TestScheduler.parseMarbles.bind(TestScheduler)

export { parseMarbles, TestMessage }
