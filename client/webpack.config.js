const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: "index.html",
    }),
  ],
  devtool: "inline-source-map",
  devServer: {
    port: 8345,
    static: "./dist",
    compress: false,
    proxy: [
      {
        context: ["/sse", "/stream"],
        target: "http://127.0.0.1:3333",
        changeOrigin: true,
        ws: true,
      },
    ],
  },
};
