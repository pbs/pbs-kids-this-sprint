const path = require('path');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = (env, { watch }) => {
  console.log({ env, watch });

  return {
    entry: `./src/js/index.ts`,
    stats: 'errors-only',
    mode: env.dev ? 'development' : 'production',

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
      path: path.join(__dirname, 'src/resources')
    },

    resolve: {
      extensions: ['.js', '.ts']
    },

    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        ENV: JSON.stringify({
          debugMode: !!env.dev,
          version: pkg.version,
        }),
        SECONDS: 1000,
        MINUTES: 60000,
        HOURS: 360000,
        DAYS: 8640000,
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
