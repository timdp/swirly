import { baseStyles } from '@swirly/theme-default-base'
import { DiagramStyles } from '@swirly/types'

export const darkStyles: DiagramStyles = {
  ...baseStyles,
  arrow_stroke_color: 'white',
  background_color: 'black',
  barrier_color: 'rgba(255, 255, 255, 0.5)',
  completion_stroke_color: 'white',
  error_color: 'white',
  event_fill_color: 'auto_dark',
  event_stroke_color: 'white',
  event_value_color: 'white',
  operator_fill_color: 'black',
  operator_stroke_color: 'white',
  operator_title_color: 'white',
  range_fill_color: 'rgba(159, 159, 159, 0.25)',
  range_stroke_color: 'white',
  stream_title_color: 'white'
}
