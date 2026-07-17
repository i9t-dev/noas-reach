const path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/src/HelloWorld.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'classic' }],
              '@babel/preset-typescript',
            ]
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'noas-reach-helloworld.js',
    path: path.resolve(__dirname, 'js/dist'),
  },
};