/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  unknownContextRegExp: /$^/,
  unknownContextCritical: false,
  // Disable handling of requires with a single expression
  exprContextRegExp: /$^/,
  exprContextCritical: false,

  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './scripts/index'
  ],
  devtool: 'eval-source-map',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ContextReplacementPlugin(
      /node-expat$/, // for the dynamic require in the chaplin lib
      "/", // look for stuff in the controllers dir
      true, // look in subdirectories
      /^\.\/.*$/ // filter: only allow request matching this RegExp 
    )
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  resolve: {
    extensions: [ '', '.js' ]
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'scripts')
    },
    { test: /\.css$/, loader: "style-loader!css-loader?importLoaders=1" },
    { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    { test: /\.md$/, loader: "html!markdown" },
    { test: /\.json$/, loader: 'json-loader' },
    { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  node: {
    dns: 'mock',
    net: 'mock',
    fs : 'empty'
  },

};
