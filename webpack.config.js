// const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = (env, { watch }) => {
  dotenv.config();

  console.log({ env, watch });

  return {
    entry: `./src/js/index.ts`,
    stats: 'errors-only',
    mode: env.dev ? 'development' : 'production',

    devServer: {
      contentBase: path.join(__dirname, '/deploy'),
      host: 'localhost',
      port: 1123
    },

    optimization: {
      minimize: !env.dev,

      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: {
              keep_fnames: true,
            },
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },

    output: {
      filename: `${process.env.npm_package_name}.js`,
      path: path.join(__dirname, 'deploy')
    },

    resolve: {
      extensions: ['.js', '.ts']
    },

    plugins: [
      // new CopyPlugin({
      //   patterns: [
      //     { from: 'static' }
      //   ],
      // }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'Build': JSON.stringify({
          debugMode: !!env.dev,
          version: pkg.version,
          token: process.env.PIVOTAL_TOKEN,
        })
      }),
      new HtmlWebpackPlugin({
        title: pkg.title,
        name: pkg.name,
        description: pkg.description,
        template: 'templates/index.html'
      })
    ],

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
          },
          exclude: /node_modules/,
        }
      ]
    }
  };
};
