export const isProduct = process.env.APP_ENV === 'prod'

// export const MIXIN_CLIENT_ID = process.env.MIXIN_CLIENT_ID
// export const MIXIN_CLIENT_ID = 'b9fee5b9-b3cb-4448-9f31-a6440ba21bf8' // 没时间
// export const MIXIN_CLIENT_ID = '8a004350-fefe-45ac-8411-5e62be2e377e' // owl test bot
export const MIXIN_CLIENT_ID = '60d30faa-3825-48da-ac1c-6aca1f573dd5' // owl

export const MIXIN_API_HOST = 'https://mixin-api.zeromesh.net'

export const MIXIN_OAUTH_HOST = 'https://mixin-www.zeromesh.net'

export const ROOT_EVENTS = {
  PIN_ENTER: 'pin_enter',
  ASSETS_FORBIDDEN: 'assets_forbidden'
}

export const MIXIN_DEPOSIT_HELP = {
  en: 'https://mixinmessenger.zendesk.com/hc/en-us/articles/360018789931-How-to-deposit-on-Mixin-Messenger-',
  zh: 'https://mixinmessenger.zendesk.com/hc/zh-cn/articles/360018789931-%E5%A6%82%E4%BD%95%E5%85%85%E5%80%BC-'
}

export const CURRENCY = {
  cny: { unit: '¥' },
  usd: { unit: '$' }
}
