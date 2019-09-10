import '@babel/polyfill'
import { Buffer } from 'buffer/'
import { drawMarbleDiagram, parseMarbleDiagramSpec } from '../lib/'

const EXAMPLE = `# An example application of the concatAll operator.
# Edit this code to redraw the diagram in real time.

x
----a------b------|
hidden

y
---c-d---|
hidden

z
---e--f-|
hidden

input
-x---y----z------|

output
-----a------b---------c-d------e--f-|
`

window.Buffer = Buffer

const resultContainer = document.querySelector('.result')
const inputField = document.querySelector('.input textarea')

let lastRendered = ''

const update = () => {
  const value = inputField.value

  if (lastRendered === value) {
    return
  }

  while (resultContainer.firstChild != null) {
    resultContainer.removeChild(resultContainer.firstChild)
  }

  try {
    const spec = parseMarbleDiagramSpec(inputField.value)
    const {
      document: { documentElement: svgElement }
    } = drawMarbleDiagram(spec)
    resultContainer.appendChild(svgElement)
  } catch (err) {
    console.error(err)
  }

  lastRendered = value
}

inputField.addEventListener('change', update)
inputField.addEventListener('keyup', update)

inputField.value = EXAMPLE

update()
