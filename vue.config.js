module.exports = {
  outputDir: 'docs',
  publicPath: undefined,
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,

  css: {
    sourceMap: true
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
}
