const webpack = require('webpack');
const { inDev } = require('./webpack.helpers');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dotenv = require('dotenv'); 


const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[next] = JSON.stringify(env[next]);
  return prev;
}, {});
// console.log(envKeys);
module.exports = [        
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
          process: {
            env: envKeys
          } 
        }),
        // inDev() && new webpack.HotModuleReplacementPlugin(),
        inDev() && new ReactRefreshWebpackPlugin(),
        new HtmlWebpackPlugin({
          template: 'src/index.html',
          favicon: '',
          inject: true,
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[name].css',
        }),
      ].filter(Boolean);
