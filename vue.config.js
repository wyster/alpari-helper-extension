module.exports = {
  filenameHashing: false,
  configureWebpack: {
    devtool: 'source-map',
    entry: {
      'background': './src/entry/background.ts',
      'page/main': './src/entry/page/main.ts',
      'content/main': './src/entry/content/main.ts'
    }
  }
}