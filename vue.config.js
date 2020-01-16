// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebextensionPlugin = require("webpack-webextension-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
  filenameHashing: false,
  css: { extract: false },

  configureWebpack: config => {
    config.devtool = "source-map";
    config.entry = {
      background: "./src/entry/background.ts",
      "page/main": "./src/entry/page/main.ts",
      "content/main": "./src/entry/content/main.ts",
      "invest-stats": "./src/entry/invest-stats.ts",
      devtools: "./src/entry/devtools.ts",
      "devtools-background": "./src/entry/devtools-background.ts"
    };
    config.output.filename = '[name].js'
    config.output.chunkFilename = '[name].js'

    // remove the existing ForkTsCheckerWebpackPlugin
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin)
    );
  },

  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config
        .mode("production")
        .output.filename("[name].js")
        .chunkFilename("[name].js");
    }
    config.optimization.delete("splitChunks");
    config
      .plugin("webextension")
      .use(WebextensionPlugin, [{ vendor: "chrome" }]);
    config.plugin("copy").use(CopyPlugin, [
      [
        {
          from: "./pages"
        },
        {
          from: "./_locales/**/*.json"
        }
      ]
    ]);

    if (process.env.NODE_ENV === "production") {
      config.plugin("fileManager").use(FileManagerPlugin, [{
        onEnd: {
          archive: [
            {source: './dist', destination: './dist/dist.zip'}
          ]
        }
      }]);
    }
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
