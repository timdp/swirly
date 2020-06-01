export type ScaleMode = 'fit' | 'none'

export interface IEventTarget {
  onSpecificationChange(code: string): void
  onThemeToggleRequested(): void
  onSvgExportRequested(): void
  onPngExportRequested(): void
  onScaleModeToggleRequested(): void
}
