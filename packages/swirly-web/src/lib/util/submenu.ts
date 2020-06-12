const overlay = document.getElementsByClassName('overlay')[0] as HTMLDivElement

let activeMenu: HTMLDivElement | null = null

export const closeSubmenu = () => {
  if (activeMenu == null) {
    return
  }
  activeMenu.style.display = 'none'
  overlay.style.display = 'none'
  activeMenu = null
}

overlay.addEventListener('click', () => {
  closeSubmenu()
  overlay.style.display = 'none'
})

export const createSubmenu = (
  button: HTMLButtonElement,
  submenu: HTMLDivElement
) => {
  button.addEventListener('click', () => {
    closeSubmenu()
    const { right, bottom } = button.getBoundingClientRect()
    submenu.style.right = document.body.clientWidth - right + 'px'
    submenu.style.top = bottom + 'px'
    submenu.style.display = 'block'
    overlay.style.display = 'block'
    activeMenu = submenu
  })
}

export const createSubmenuButton = (
  label: string,
  onClick: () => void
): HTMLElement => {
  const div: HTMLDivElement = document.createElement('div')
  div.className = 'button'
  const button: HTMLButtonElement = document.createElement('button')
  button.textContent = label
  button.addEventListener('click', () => {
    closeSubmenu()
    onClick()
  })
  div.appendChild(button)
  return div
}
