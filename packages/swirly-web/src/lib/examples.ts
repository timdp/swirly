import dedent from 'dedent'

import { Example } from './types'

export const examples: readonly Example[] = [
  {
    title: 'concatAll',
    code: dedent(`
      x = ----a------b------|

      y = ---c-d---|

      z = ---e--f-|

      -x---y----z------|

      > concatAll

      -----a------b---------c-d------e--f-|
    `)
  },
  {
    title: 'onErrorResumeNext',
    code: dedent(`
      --a--b--#
      title = source

      --c--d--|
      title = next

      > onErrorResumeNext

      --a--b----c--d--|
      title = output
    `)
  },
  {
    title: 'pluck',
    code: dedent(`
      [styles]
      event_radius = 30
      operator_height = 60

      --a--b--c--|
      a := {v:1}
      b := {v:2}
      c := {v:3}

      > pluck('v')

      --x--y--z--|
      x := 1
      y := 2
      z := 3
    `)
  },
  {
    title: 'skipUntil',
    code: dedent(`
      --a--b--c--d--e----|

      ---------x------|

      > skipUntil

      -----------d--e----|
    `)
  },
  {
    title: 'zipAll',
    code: dedent(`
      x = -a-----b-|

      y = --1-2-----

      -x----y--------|

      > zipAll

      -----------------A----B-|
      A := a1
      B := b2
    `)
  }
]
