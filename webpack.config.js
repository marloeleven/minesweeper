var path = require('path')

module.exports = {
    entry: "./js/main.js",
    resolve: {
      extensions: ['', '.js'],
      root: [path.join(__dirname, 'js'), path.join(__dirname, 'node_modules')]
    },
    output: {
        filename: "bundle.js",
        path: __dirname
    },
    module: {
        loaders: [
          {
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
              presets: ['es2015'],
              cacheDirectory: true
            }
          }
        ]
    }
}