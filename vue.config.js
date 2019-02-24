module.exports = {
  filenameHashing: false,
  configureWebpack: {
    devtool: 'source-map',
    entry: {
      'background': './src/background.ts'
    }
  }
}