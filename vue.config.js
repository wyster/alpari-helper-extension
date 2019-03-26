module.exports = {
  filenameHashing: false,
  css: {extract: false},
  configureWebpack: {
    devtool: 'source-map',
    entry: {
      'background': './src/entry/background.ts',
      'page/main': './src/entry/page/main.ts',
      'content/main': './src/entry/content/main.ts',
      'invest-stats': './src/entry/invest-stats.ts',
      'store-manager': './src/entry/store-manager.ts'
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config
          .mode('production')
          .output
          .filename('[name].js')
          .chunkFilename('[name].js');
    }
    config.optimization.delete('splitChunks');
  }
}