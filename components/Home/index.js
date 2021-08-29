import { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ProfileContext } from '../../stores/useProfile'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import TopBar from '../TopBar'
import Icon from '../../widgets/Icon'
import Input from '../../widgets/Input'
import Avatar from '../../widgets/Avatar'
import Loading from '../../widgets/Loading'
import BottomSheet from '../../widgets/BottomSheet'
import { authLogin } from '../../utils/loginUtil'
import { checkGroup, parseFeed, parseTopic, subscribeTopic } from '../../services/api/owl'
import { getMixinContext } from '../../services/api/mixin'
import storageUtil from '../../utils/storageUtil'
import styles from './index.module.scss'

function Home(props) {
  const { t } = useTranslation('common')
  const [ state ]  = useContext(ProfileContext)
  console.log('state at homepage:', state.profile)
  const [ userInfo, setUserInfo ] = useState('')
  const isLogin = state.profile.user_name !== undefined || (userInfo && userInfo.user_name)

  const [ feed, setFeed ] = useState('')
  const [ show, setShow ] = useState(false)
  const [ showSubscribe, setShowSubscribe ] = useState(false)
  const defaultType = {
    type: 'topic',
    icon: 'oak-leaf',
    name: t('oak'),
    placeholder: t('oak_ph'),
  }
  const [ feedType, setFeedType ] = useState(defaultType)
  const [ feedInfo, setFeedInfo ] = useState({})
  const [ ctx, setCtx ] = useState({})
  const [ groupInfo, setGroupInfo ] = useState(false)
  const [ monthlyPrice, setMonthlyPrice ] = useState(0)
  const [ yearlyPrice, setYearlyPrice ] = useState(0)
  const [ chargeCrypto, setChargeCrypto ] = useState({})
  const [ selectPeriod, setSelectPeriod ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const feedOptions = [
    {
      type: 'topic',
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
    {
      type: 'youtube',
      icon: 'youtube-fill',
      name: t('youtube'),
      placeholder: t('youtube_ph'),
    }
  ]

  const subscribeOptions = [
    {
      period: 'month',
      price: monthlyPrice
    },
    {
      period: 'year',
      price: yearlyPrice
    }
  ]

  const prefix = (
    <Icon
      type="search"
      className={styles.searchIcon}
    />
  )

  const handleSearch = (val) => {
    setFeed(val)
  }

  const handleClear = () => {
    setFeedInfo({})
    setSelectPeriod('')
  }

  const parseExternalFeed = async (feed) => {
    const params = {
      action: 'parse_uri',
      uri: feed
    }
    const res = await parseFeed(params)
    // if (res.tid) {
    //   setFeedInfo(res)
    //   const monPrice = Number(res.price.monthly) + Number(res.service_charge.monthly)
    //   const yearPrice = Number(res.price.yearly) + Number(res.service_charge.yearly)
    //   setMonthlyPrice(monPrice)
    //   setYearlyPrice(yearPrice)
    //   setChargeCrypto(res.service_charge.currency)
    //   setLoading(false)
    // }
    res?.tid && setFeedInfo(res)
    setLoading(false)
  }

  const parseInternalTopic = async (feed) => {
    const uri = 'oth:' + feedType.type + '/user/' + feed
    const params = {
      action: 'query',
      uri: uri,
    }
    const res = await parseTopic(params) || {}
    if (res.tid) {
      setFeedInfo(res)
      const monPrice = Number(res.price.monthly) + Number(res.service_charge.monthly)
      const yearPrice = Number(res.price.yearly) + Number(res.service_charge.yearly)
      setMonthlyPrice(monPrice)
      setYearlyPrice(yearPrice)
      setChargeCrypto(res.service_charge.currency)
      setLoading(false)
    } else if (res.message = 'Does not exist.') {
      let parseUrl = ''
      switch (feedType.type) {
        case 'oak':
          parseUrl = uri
          break
        case 'weibo':
          parseUrl = 'https://weibo.com/' + feed
          break
        case 'twitter':
          parseUrl = 'https://twitter.com/' + feed
          break
        default:
          break
      }
      parseExternalFeed(parseUrl)
    }
  }

  const handleSubscribe = async (period) => {
    const params = {
      action: 'follow',
      tid: feedInfo.tid,
      period: period
    }
    const res = await subscribeTopic(params) || {}
    if (res.payment_uri) {
      window.open(res.payment_uri)
      setShowSubscribe(false)
    }
  }

  const handleParse = async (feed) => {
    setLoading(true)
    if (feedType.type === 'rss') {
      parseExternalFeed(feed)
    } else {
      parseInternalTopic(feed)
    }
  }

  const handleKeyDown = (e) => {
    const enterPressed = e.keyCode === 13
    if (enterPressed && !isLogin) {
      authLogin()
      return
    }
    if (enterPressed && isLogin) {
      handleParse(feed)
      e.target.blur()
    }
  }

  useEffect(() => {
    // storageUtil.get(`user_info_${ctx?.conversation_id}`) && setUserInfo(storageUtil.get('user_info'))
    // key = localStorage.key(1)
    // console.log('key:', key)
  }, [])

  useEffect(async () => {
    const res = getMixinContext()
    setCtx(res)
    if (!res?.app_version) {
      storageUtil.set('platform', 'browser')
    }
    const conversation_id = ctx.conversation_id || '653f40a1-ea00-4a9c-8bb8-6a658025a90e'
    console.log('u key:', `user_info_${res?.conversation_id}`)
    storageUtil.get(`user_info_${res?.conversation_id || ''}`) && setUserInfo(storageUtil.get(`user_info_${res?.conversation_id || ''}`))
    storageUtil.set('current_conversation_id', res?.conversation_id || null)
    if (res?.conversation_id) {
      const data = await checkGroup({conversation_id: res.conversation_id})
      if (!res?.err_code) {
        setGroupInfo(data)
      }
    }
    // storageUtil.get(`user_info_${conversation_id}`) && setUserInfo(storageUtil.get(`user_info_${conversation_id}`))
    res.appearance && document.documentElement.setAttribute('data-theme', res.appearance)
  }, [])

  // useEffect(async () => {
  //   const data = {
  //     // conversation_id: ctx.conversation_id,
  //     conversation_id: '653f40a1-ea00-4a9c-8bb8-6a658025a90e',
  //     code: ''
  //   }
  //   const res = await owlSignIn(data)
  //   setGroupData(res)
  // }, [ctx])

  useEffect(async () => {
    // const res = await checkGroup({conversation_id: '653f40a1-ea00-4a9c-8bb8-6a658025a90e'})
    // if (ctx?.conversation_id) {
    //   const res = await checkGroup({conversation_id: ctx.conversation_id})
    //   if (!res?.err_code) {
    //     setGroupInfo(res)
    //   }
    // }
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <meta name="theme-color" content={ ctx.appearance === 'dark' ? "#080808" : "#FFFFFF"} />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TopBar />

      {/* 登录状态 */}
      {
        isLogin ?
        <div className={styles.avatar}>
          <Link href="/user" >
            <a>
              <Avatar group={groupInfo?.is_group} imgSrc={userInfo?.user_icon} />
            </a>
          </Link>
        </div>
        :
        <div
          className={styles.login}
          onClick={() => authLogin()}
        >
          <span>
            {groupInfo?.is_group ? t('owner_login') : t('login')}
          </span>
        </div>
      }

      {/* 类型选择框 */}
      <div className={styles.options}>
        <span>{t('current_type')}{t('colon')}</span>
        <div
          className={`${show && styles.optionsActive}`}
          onClick={() => setShow(true)}
        >
          <Icon type={feedType.icon} className={styles.curIcon} />
          <span>{feedType.name}</span>
          <Icon
            type="triangle-flat"
            className={`${styles.triangle} ${show && styles.triangleActive}`}
          />
        </div>
      </div>

      {/* 搜索框 */}
      <div className={styles.search}>
        <Input
          className={styles.input}
          type="search"
          prefix={prefix}
          placeholder={feedType.placeholder}
          value={feed}
          onChange={handleSearch}
          onClear={handleClear}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      {/* 解析后源信息卡片 */}
      {
        loading ?
        <div className={styles.loadingWrap}>
          <Loading size={30} className={styles.loading} />
          <span className={styles.loadingHint}>
            {t('loading_hint')}
          </span>
        </div>
        :
        feedInfo?.tid &&
        <>
          <div className={styles.feedInfo}>
            <div className={styles.feedDesc}>
              <div>
                <p>
                  {feedInfo.title}
                </p>
                {
                  feedInfo.desc &&
                  <p>{t('desc')}{t('colon')}{feedInfo.desc}</p>
                }
              </div>
              <button
                onClick={() => {
                  setShowSubscribe(true)
                }}
              >
                {t('follow')}
              </button>
            </div>
          </div>
          <div className={styles.feedPrice}>
            <p>订阅价格：</p>
            <div>
              <p>
                {monthlyPrice} {chargeCrypto.symbol} / month
              </p>
              <div className={styles.divider}></div>
              <p>
                {yearlyPrice} {chargeCrypto.symbol} / year
              </p>
            </div>
          </div>
        </>
      }

      {/* 搜索源选项 */}
      <BottomSheet
        show={show}
        onClose={() => setShow(false)}
      >
        <div className={styles.sheet}>
          {
            feedOptions.map((item) => {
              const isSelected = item.name === feedType.name
              return (
                <div
                  key={item.type}
                  className={`${isSelected && styles.optionSelected}`}
                  onClick={() => {
                    setFeedType(item)
                    setShow(false)
                  }}
                >
                  <p>
                    <Icon type={item.icon} className={styles.feedIcon} />
                    {item.name}
                    {item.remark && <span>{item.remark}</span>}
                  </p>
                  {
                    isSelected &&
                    <Icon type="check-line" className={styles.selected} />
                  }
                </div>
              )
            })
          }
        </div>
      </BottomSheet>

      {/* 订阅选项 */}
      <BottomSheet
        show={showSubscribe}
        withConfirm={true}
        confirmTitle={t('select_plan')}
        confirmText={'支 付'}
        onClose={() => {
          setSelectPeriod('')
          setShowSubscribe(false)
        }}
        onCancel={() => {
          setSelectPeriod('')
          setShowSubscribe(false)
        }}
        onConfirm={() => handleSubscribe(selectPeriod)}
      >
        <div className={styles.sheet}>
          {
            subscribeOptions.map((item) => {
              return (
                <div
                  key={item.period}
                  className={`${item.period === selectPeriod && styles.optionSelected}`}
                  onClick={() => {
                    setSelectPeriod(item.period)
                  }}
                >
                  <p className={styles.subcribePrice}>
                    <div>
                      <img
                        src={chargeCrypto.icon_url}
                        alt="crypto"
                      />
                      {item.price} {chargeCrypto.symbol} / {t(item.period)}
                    </div>
                  </p>
                  {
                    item.period === selectPeriod &&
                    <Icon type="check-line" className={styles.selected} />
                  }
                </div>
              )
            })
          }
        </div>
      </BottomSheet>
    </div>
  )
}

export default Home