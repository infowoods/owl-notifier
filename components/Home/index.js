import { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ProfileContext } from '../../stores/useProfile'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import TopBar from '../TopBar'
import Icon from '../../widgets/Icon'
import Input from '../../widgets/Input'
import Loading from '../../widgets/Loading'
import BottomSheet from '../../widgets/BottomSheet'
import { authLogin } from '../../utils/loginUtil'
import { parseFeed, parseTopic, subscribeTopic } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import styles from './index.module.scss'

function Home(props) {
  const { t } = useTranslation('common')
  const [ state ]  = useContext(ProfileContext)
  console.log('state at homepage:', state.profile)
  const [ userInfo, setUserInfo ] = useState('')
  const isLogin = state.profile.user_name !== undefined || (userInfo && userInfo.user_name)
  console.log('user_info:', userInfo)

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
  const [ monthlyPrice, setMonthlyPrice ] = useState(0)
  const [ yearlyPrice, setYearlyPrice ] = useState(0)
  const [ chargeCrypto, setChargeCrypto ] = useState({})
  const [ loading, setLoading ] = useState(false)
  console.log('feedInfo:', feedInfo)

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

  const parseExternalFeed = async (feed) => {
    const params = {
      action: 'parse_uri',
      uri: feed
    }
    const res = await parseFeed(params)
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
    }
  }

  const handleParse = async (feed) => {
    if (feedType.type === 'rss') {
      setLoading(true)
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
    storageUtil.get('user_info') && setUserInfo(storageUtil.get('user_info'))
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TopBar />

      {
        isLogin ?
        <div className={styles.avatar}>
          <Link href="/user" >
            <a>
              <Image
                src={state.profile.user_icon || (userInfo && userInfo.user_icon)}
                alt="avatar"
                width={35}
                height={35}
              />
            </a>
          </Link>
        </div>
        :
        <div
          className={styles.login}
          onClick={() => authLogin()}
        >
          <span>
            {t('login')}
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
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      {/* 解析后源信息卡片 */}
      {
        loading ?
        <div className={styles.feedInfo}>
          <Loading size={30} className={styles.loading} />
          <span className={styles.loadingHint}>
            {t('loading_hint')}
          </span>
        </div>
        :
        feedInfo?.tid &&
        <div className={styles.feedInfo}>
          <div>
            <p>
              {feedInfo.title}
            </p>
            {
              feedInfo.desc &&
              <p>{feedInfo.desc}</p>
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
        onClose={() => setShowSubscribe(false)}
      >
        <div className={styles.sheet}>
          <p className={styles.optionsTitle}>
            {t('select_plan')}
          </p>
          {
            subscribeOptions.map((item) => {
              return (
                <div
                  key={item.period}
                  onClick={() => {
                    setShowSubscribe(false)
                    handleSubscribe(item.period)
                  }}
                >
                  <p className={styles.price}>
                    <img
                      src={chargeCrypto.icon_url}
                      // src="https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128"
                      alt="crypto"
                      // width={15}
                      // height={15}
                    />
                    {item.price} {chargeCrypto.symbol} / {item.period}
                  </p>
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