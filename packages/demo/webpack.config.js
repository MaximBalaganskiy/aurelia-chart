/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const outDir = path.resolve(__dirname, 'dist');
module.exports = function (env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';

  return {
    mode: production === 'production' ? 'production' : 'development',
    devtool: production ? 'source-map' : 'eval-source-map',
    output: {
      path: outDir,
      filename: production ? '[name].[chunkhash].bundle.js' : '[name].[fullhash].bundle.js',
      sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[fullhash].bundle.map',
      chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[fullhash].chunk.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['src', 'node_modules', '../../node_modules'].map(x => path.resolve(x)),
      alias: {
        'src': path.resolve(__dirname, 'src'),
        'aurelia-chart': path.resolve(__dirname, `../aurelia-chart/src`)
      }
    },
    entry: {
      app: './src/main.ts'
    },
    module: {
      rules: [
        { test: /\.(png|gif|jpg|cur|ttf|eot|svg|otf|woff2|woff)$/i, type: 'asset' },
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        { test: /\.js$/, enforce: 'pre', use: ['source-map-loader'], include: [/@aurelia\\kernel/] },
        { test: /\.html$/i, use: '@aurelia/webpack-loader', exclude: /node_modules/ }
     ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './index.ejs' }),
      analyze && new BundleAnalyzerPlugin()
    ].filter(p => p)
  };
};
