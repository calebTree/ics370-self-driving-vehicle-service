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
    react: './src/react.js'
  },
  output: {
    filename: './[name].js',
    path: path.resolve(__dirname, 'public/scripts'),
    clean: true,
  },

  module: {
    rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            // exclude: /src\/index.js/
        },
      ]
    }
};

module.exports = [appConfig];
