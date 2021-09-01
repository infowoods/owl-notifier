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
import PriceSheet from './PriceSheet'
import FeedTypeSheet from './FeedTypeSheet'
import { feedOptions, subscribeOptions } from './config'
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
  const [ feedError, setFeedError ] = useState('')
  const [ ctx, setCtx ] = useState({})
  const [ groupInfo, setGroupInfo ] = useState(false)
  const [ monthlyPrice, setMonthlyPrice ] = useState(0)
  const [ yearlyPrice, setYearlyPrice ] = useState(0)
  const [ chargeCrypto, setChargeCrypto ] = useState({})
  const [ selectPeriod, setSelectPeriod ] = useState('')
  const [ loading, setLoading ] = useState(false)

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
    const uri = 'oth:' + feedType.type + '/user/' + feed
    let parseUrl
    switch (feedType.type) {
      case 'rss':
        parseUrl = feed
        break
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
    const params = {
      action: 'parse_uri',
      uri: parseUrl
    }
    try {
      const res = await parseFeed(params)
      if (res?.price) {
        setFeedInfo(res)
        const monPrice = (Number(res.price.monthly) + Number(res.service_charge.monthly)).toFixed(8).replace(/\.?0+$/,"")
        const yearPrice = (Number(res.price.yearly) + Number(res.service_charge.yearly)).toFixed(8).replace(/\.?0+$/,"")
        setMonthlyPrice(monPrice)
        setYearlyPrice(yearPrice)
        setChargeCrypto(res.service_charge.currency)
        setLoading(false)
      }
    } catch (error) {
      setFeedError(error?.data.message)
      setLoading(false)
    }
  }

  const parseInternalTopic = async (feed) => {
    const uri = 'oth:' + feedType.type + '/user/' + feed
    const params = {
      action: 'query',
      uri: uri,
    }
    try {
      const res = await parseTopic(params) || {}
      if (res.tid) {
        setFeedInfo(res)
        const monPrice = Number(res.price.monthly) + Number(res.service_charge.monthly)
        const yearPrice = Number(res.price.yearly) + Number(res.service_charge.yearly)
        setMonthlyPrice(monPrice)
        setYearlyPrice(yearPrice)
        setChargeCrypto(res.service_charge.currency)
        setLoading(false)
      } else {
        setFeedError(res)
      }
    } catch (error) {
      if (error?.data.message === 'Does not exist.') {
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
    parseExternalFeed(feed)
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
        setLoading(false)
        setGroupInfo(data)
      }
    }
    // storageUtil.get(`user_info_${conversation_id}`) && setUserInfo(storageUtil.get(`user_info_${conversation_id}`))
    res.appearance && document.documentElement.setAttribute('data-theme', res.appearance)
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

      {/* 搜索类型选择 */}
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
            <p>{t('subcribe_price')}{t('colon')}</p>
            <div>
              <p>
                {monthlyPrice} {chargeCrypto.symbol} / {t('month')}
              </p>
              <div className={styles.divider}></div>
              <p>
                {yearlyPrice} {chargeCrypto.symbol} / {t('year')}
              </p>
            </div>
          </div>
        </>
      }

      {/* 解析错误 */}
      {
        feedError &&
        <div className={styles.feedInfo}>
          <Icon type="info-fill" />
          解析失败：请检查输入内容与当前搜索类型是否匹配
        </div>
      }

      {/* 搜索源选项 */}
      <FeedTypeSheet
        t={t}
        show={show}
        onClose={() => setShow(false)}
        feedOptions={feedOptions(t)}
        feedType={feedType}
        setFeedType = {setFeedType}
        setFeedInfo = {setFeedInfo}
        setShow = {setShow}
      />

      {/* 订阅价格选项 */}
      <PriceSheet
        t={t}
        show={showSubscribe}
        withConfirm={true}
        confirmTitle={t('select_plan')}
        confirmText={t('pay')}
        onClose={() => {
          setSelectPeriod('')
          setShowSubscribe(false)
        }}
        onCancel={() => {
          setSelectPeriod('')
          setShowSubscribe(false)
        }}
        onConfirm={() => handleSubscribe(selectPeriod)}
        options={subscribeOptions(monthlyPrice, yearlyPrice)}
        selectPeriod={selectPeriod}
        chargeCrypto={chargeCrypto}
        setSelectPeriod={setSelectPeriod}
      />
    </div>
  )
}

export default Home