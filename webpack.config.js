// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const webpack = require("webpack");
const path = require('path');
const glob = require('glob');
const minifyPlugin = require("babel-minify-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');

const enabledSourceMap = true;
const entry = {}
const entries = glob.sync("./src/**/**/*.js", {
  ignore: ['./src/**/**/_*.js']
});
entries.map(path => {
  entry[path.replace(/\.\/src/, '')] = path;
  return path;
});
console.log(entry);
// const entries = {
//   app: './src/js/app.js'
// }

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: entry,
  // 出力の設定
  plugins: [
    new minifyPlugin({}, {
      test: /\.js$/,
    }),
    new htmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]___[hash:base64:5]___[path][name]___/',
              sourceMap: enabledSourceMap,
            }
          }
        ]
      }
    ]
  },

  output: {
    // 出力するファイル名
    filename: '[name]',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, './public')
  }
};
