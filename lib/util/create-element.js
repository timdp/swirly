const createElement = (document, name, attrs = {}, text = '') => {
  const $el = document.createElement(name)

  for (const [name, value] of Object.entries(attrs)) {
    $el.setAttribute(name, '' + value)
  }

  if (text !== '') {
    $el.textContent = '' + text
  }

  return $el
}

module.exports = { createElement }
