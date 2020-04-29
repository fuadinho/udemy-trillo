/**
 * @author Nyctocode
 * @link https://nyctocode.hr/
 */

/*==[ IMPORTS ]==*/
const path = require('path');
const webpack = require('webpack');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
/*===============*/

/*==[ CHANGE SETTINGS HERE ]==*/
const config = {
  context: 'src',
  entry: {
    main: [
      './scripts/main.js',
      './styles/main.scss',
    ]
  },
  outputPath: 'public/assets',
  publicPath: '/assets/',
  devServerPort: 9000,
  browserSyncPort: 3000,
};
/*============================*/

/*==[ DO NOT CHANGE IF NOT REALLY NECESSARY! ]==*/

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(config.context),
  entry: config.entry,
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(config.outputPath),
    publicPath: config.publicPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: devMode
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: devMode,
              config: {
                ctx: {
                  'postcss-preset-env': {},
                  'cssnano': {
                    discardComments: true
                  }
                }
              }
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: devMode
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff2?|svg|jpe?g|png|gif|ico|webp|mp4|mp3)$/,
        loader: devMode ? 'file-loader' : 'url-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          limit: 4096,
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: path.resolve(config.context),
        to: path.resolve(config.outputPath),
      }
    ], {
      ignore: ['*.ts', '*.tsx', '*.js', '*.jsx', '*.css', '*.scss', '*.sass', '*.gitkeep']
    }),
    ...(devMode ? [
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsPlugin(),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: config.browserSyncPort,
        proxy: `http://localhost:${config.devServerPort}/`,
        logLevel: 'silent',
        files: [
          './public/**/*.html',
        ],
      }, {
        reload: false
      }),
    ] : [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
      }),
    ]),
  ],
  devServer: {
    contentBase: path.resolve('public'),
    port: config.devServerPort,
    clientLogLevel: 'silent',
    hot: true,
    noInfo: true,
    overlay: true,
    quiet: true,
  },
  optimization: {
    minimize: !devMode,
    minimizer: [
      new TerserPlugin(),
    ],
  },
  mode: devMode ? 'development' : 'production',
  stats: {
    colors: true,
    chunks: false,
    modules: false,
    entrypoints: false,
    children: false
  },
  devtool: devMode ? 'eval-cheap-source-map' : false,
};
/*==============================================*/