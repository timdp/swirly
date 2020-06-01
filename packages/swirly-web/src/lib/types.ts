export type ScaleMode = 'fit' | 'none'

export interface IEventTarget {
  onSpecificationChange(code: string): void
  onThemeToggleRequested(): void
  onScaleModeToggleRequested(): void
  onSvgExportRequested(): void
  onPngExportRequested(): void
}
