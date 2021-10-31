const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rootConfig = {
  mode: 'development',
  optimization: {
    usedExports: true, // tells webpack to tree-shake
  },
  devtool: 'eval-source-map'
};

const appConfig = {
  ...rootConfig,
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: './[name].js',
    path: path.resolve(__dirname, 'public/scripts'),
    publicPath: '/',
    clean: true,
  },
  plugins: [new MiniCssExtractPlugin({
    filename: "../styles/[name].css",
  })],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '../images/[base]'
        },
      },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        },
        {
          test: /.s?css$/,
          // to-do: learn why background doesn't load with css extract
          // use: [
          //   {
          //     loader: MiniCssExtractPlugin.loader,
          //     options: {
          //       publicPath: '../'
          //     },
          //   },
          //   'css-loader', 'sass-loader',
          // ],
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ]
    }
};

module.exports = [appConfig];
