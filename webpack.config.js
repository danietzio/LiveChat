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
          },{
              test: /\.png$/,
              exclude: /node_modules/,
              loader: 'file-loader?name=images/[name].[ext]'
          }]
    }
};

module.exports = { clientConfig }
