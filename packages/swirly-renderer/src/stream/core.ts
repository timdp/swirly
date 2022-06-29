import { renderMessage } from '../message/index.js'
import { createRenderStream } from './factory.js'

export const renderStreamBase = createRenderStream(renderMessage)
