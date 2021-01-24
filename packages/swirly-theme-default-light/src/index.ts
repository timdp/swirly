import { baseStyles } from '@swirly/theme-default-base'
import { DiagramStyles } from '@swirly/types'

export const lightStyles: DiagramStyles = {
  ...baseStyles,
  arrow_stroke_color: 'black',
  background_color: 'white',
  barrier_color: 'rgba(0, 0, 0, 0.5)',
  completion_stroke_color: 'black',
  error_color: 'black',
  event_fill_color: 'auto_light',
  event_stroke_color: 'black',
  event_value_color: 'black',
  operator_fill_color: 'white',
  operator_stroke_color: 'black',
  operator_title_color: 'black',
  range_fill_color: 'rgba(95, 95, 95, 0.25)',
  range_stroke_color: 'black',
  stream_title_color: 'black'
}
