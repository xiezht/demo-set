const path = require('path')

console.log(process.env.NODE_ENV)

module.exports = {
  entry: path.resolve(__dirname, 'file-loader.js'),
  // entry: 'file-loader.js',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: (url, resourcePath, context) => {
            // console.log(url, resourcePath, context)
            return `images/${url}`
          },
          publicPath: 'hdhjkdfhi',
          postTransformPublicPath: (p) => {
            console.log(__webpack_public_path__)
            console.log(p)
            // return `__webpack_public_path__${p}`
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  }
}
