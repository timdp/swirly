import { renderMessage } from '../message'
import { createRenderStream } from './factory'

export const renderStreamBase = createRenderStream(renderMessage)
