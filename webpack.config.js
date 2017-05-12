var webpack = require('webpack');

var clientConfig = {
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader'
        }, {
            test: /\.css$/,
            loader: 'css-loader',
        },{
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }]
    }
};

var serverConfig = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },{
        test: /\.json$/,
        loader: "json",
      }
    ]
  },
  "target" : "node",
  "node" : {
    "fs" : "empty"
  }
}

module.exports = { clientConfig, serverConfig }
