const path = require('path');
//borrowed from Kevin's fabric browser
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");

module.exports = {
  entry: './src/index.js',
  target: "web", //from frowser
  // target: "node",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  //frowser shit
  devServer: {
    contentBase: './dist',
    hot: true,
    disableHostCheck: true,
    inline: true,
    port: 7000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Methods": "POST"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env', "@babel/preset-react"],
          plugins: [
            require("@babel/plugin-proposal-object-rest-spread"),
            require("@babel/plugin-transform-regenerator"),
            require("@babel/plugin-transform-runtime")
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer({ grid: true })]
            }
          },
          { loader: "sass-loader" }
        ]
      },

          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  name: '[name].[ext]',
                  // outputPath: 'fonts/'
                }
              }
            ]
          }
        ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
   new webpack.HotModuleReplacementPlugin()
 ],
};
