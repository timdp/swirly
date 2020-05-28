import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/cli.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      browser: true,
      extensions: ['.js', '.ts'],
      resolveOnly: ['src', /^swirly-/]
    }),
    typescript({
      include: ['./**/*.ts', '../swirly-*/**/*.ts']
    })
  ]
}
