module.exports = {
  "devServer": {
    "proxy": "http://127.0.0.1:8000/"
  },
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: (config) => {
    config.module.rule('pdf')
      .test(/\.pdf$/)
      .use('file-loader').loader('file-loader')
  }
}
