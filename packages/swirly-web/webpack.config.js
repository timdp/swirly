const path = require('path')
const { DefinePlugin } = require('webpack')

const { version } = require('../../lerna.json')

const baseConfig = {
  target: 'web',
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          logLevel: 'info',
          projectReferences: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new DefinePlugin({
      VERSION: JSON.stringify(version)
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist')
  }
}

const configs = [
  { mode: 'development', outputFilename: 'bundle.js', devtool: 'source-map' },
  { mode: 'production', outputFilename: 'bundle.min.js', devtool: false }
]

module.exports = configs.map(({ mode, outputFilename, devtool }) => ({
  ...baseConfig,
  mode,
  output: { ...baseConfig.output, filename: outputFilename },
  devtool
}))
