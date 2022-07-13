export function rotateX (x: number, y: number, angel: number): number {
  return x * Math.cos(angel) - y * Math.sin(angel)
}
