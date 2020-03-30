const { resolve, join } = require('path');
const pkg = require('./package.json');

const config = {
  devtool: 'eval',
  entry: resolve(__dirname, 'src/index.ts'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryExport: 'default',
    libraryTarget: 'umd',
    library: pkg.libraryConfig.name
  },
  resolve: {
    extensions: ['.json', '.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declarationDir: 'types',
          },
        },
        exclude: /node_modules/
      },
    ]
  }
}

module.exports = config;
