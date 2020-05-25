const path = require('path')

const baseConfig = {
  target: 'web',
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'swc-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
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
