export function removeChildren (parent: Node): void {
  while (parent.lastChild !== null) {
    parent.removeChild(parent.lastChild)
  }
}
