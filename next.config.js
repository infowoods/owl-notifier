const path = require('path')
// const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "styles/vars.scss";`
  },
  images: {
    domains: ['mixin-images.zeromesh.net'],
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
  },
}