const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
      // new BundleAnalyzerPlugin()
    ]
  }
};