export const feedOptions = (t) => [
  {
    type: 'oak',
    icon: 'oak-leaf',
    name: t('oak'),
    placeholder: t('oak_ph'),
  },
  {
    type: 'rss',
    icon: 'rss',
    name: t('rss'),
    remark: 'Atom / RSS',
    placeholder: t('rss_ph'),
  },
  {
    type: 'weibo',
    icon: 'weibo-fill',
    name: t('weibo'),
    placeholder: t('weibo_ph'),
  },
  {
    type: 'twitter',
    icon: 'twitter-fill',
    name: t('twitter'),
    placeholder: t('twitter_ph'),
  },
  // {
  //   type: 'youtube',
  //   icon: 'youtube-fill',
  //   name: t('youtube'),
  //   placeholder: t('youtube_ph'),
  // }
]

export const subscribeOptions = (monthlyPrice, yearlyPrice) => [
  {
    period: 'month',
    price: monthlyPrice,
  },
  {
    period: 'year',
    price: yearlyPrice,
  },
]
