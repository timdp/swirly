import {
  DecorationSpecification,
  DiagramStyles,
  MessageSpecification
} from 'swirly-types'

export type Point = {
  x: number
  y: number
}

export type Rectangle = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type TimeScaler = (time: number) => number

export type RendererOptions = {
  DOMParser?: typeof DOMParser
  styles?: DiagramStyles
}

export type RendererContext = {
  document: XMLDocument
  styles: DiagramStyles
  streamHeight: number
  nextIndex: () => number
}

export type RendererResult = {
  element: SVGElement
  bbox: Rectangle
}

export type PostRenderUpdateContext = {
  width: number
  height: number
}

export type UpdatableRendererResult = RendererResult & {
  update: (ctx: PostRenderUpdateContext) => void
}

export type MessageRendererOptions = {
  verticalOffset: number
  valueAngle: number
}

export type MessageRenderer = (
  ctx: RendererContext,
  message: MessageSpecification,
  options: MessageRendererOptions
) => RendererResult

export type DecorationRendererContext = RendererContext & {
  bbox: Rectangle
  scaleTime: TimeScaler
}

export type DecorationRendererResult = {
  element: SVGElement
  bbox?: Rectangle
}

export type DecorationRenderer = (
  ctx: DecorationRendererContext,
  decoration: DecorationSpecification
) => DecorationRendererResult
