const path = require('path');

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

  module: {
    rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
      ]
    }
};

module.exports = [appConfig];
