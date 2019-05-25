// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebextensionPlugin = require("webpack-webextension-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  filenameHashing: false,
  css: { extract: false },

  configureWebpack: {
    devtool: "source-map",
    entry: {
      background: "./src/entry/background.ts",
      "page/main": "./src/entry/page/main.ts",
      "content/main": "./src/entry/content/main.ts",
      "invest-stats": "./src/entry/invest-stats.ts",
      "store-manager": "./src/entry/store-manager.ts",
      devtools: "./src/entry/devtools.ts",
      "devtools-background": "./src/entry/devtools-background.ts"
    }
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
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
