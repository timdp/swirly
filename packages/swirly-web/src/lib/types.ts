export type ScaleMode = 'fit' | 'none'

export type Example = {
  title: string
  code: string
}

export interface IEventTarget {
  onSpecificationChange(code: string): void
  onThemeToggleRequested(): void
  onScaleModeToggleRequested(): void
  onSpecificationExportRequested(): void
  onSvgExportRequested(): void
  onPngExportRequested(): void
  onExampleRequested(example: Example): void
}
