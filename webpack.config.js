const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    index: [
      path.resolve(__dirname, 'utils.js'),
      path.resolve(__dirname, 'connect.js')
    ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname),
    library: '@mono.co/connect.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },

	optimization: {
		minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: { comments: false }
      }
    })],
  }
};