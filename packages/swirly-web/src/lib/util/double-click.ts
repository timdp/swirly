const DOUBLECLICK_INTERVAL = 500

export const onDoubleClick = (
  element: HTMLElement,
  listener: (event: Event) => void
) => {
  let lastClick: number = 0

  element.addEventListener('click', function (event) {
    const now = Date.now()
    const elapsed = now - lastClick
    if (elapsed < DOUBLECLICK_INTERVAL) {
      lastClick = 0
      listener.call(this, event)
    } else {
      lastClick = now
    }
  })
}
