const updateBodyHeight = () => {
  document.body.style.height = window.innerHeight + 'px'
}

export const maintainFullHeight = () => {
  updateBodyHeight()
  window.addEventListener('resize', updateBodyHeight)
  window.addEventListener('orientationchange', updateBodyHeight)
}
