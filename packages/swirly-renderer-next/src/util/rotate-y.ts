export function rotateY (x: number, y: number, angel: number): number {
  return x * Math.sin(angel) + y * Math.cos(angel)
}
