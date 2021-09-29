import { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { ProfileContext } from '../../stores/useProfile'
import toast from 'react-hot-toast'
const OwlToast = dynamic(() => import('../../widgets/OwlToast'))
const Overlay = dynamic(() => import('../../widgets/Overlay'))
const QrCodeSheet = dynamic(() => import('./QrCodeSheet'))
const PriceSheet = dynamic(() => import('./PriceSheet'))
const FeedTypeSheet = dynamic(() => import('./FeedTypeSheet'))
import Icon from '../../widgets/Icon'
import Input from '../../widgets/Input'
import Loading from '../../widgets/Loading'
import { feedOptions, subscribeOptions } from './config'
import { authLogin } from '../../utils/loginUtil'
import { parseFeed, subscribeTopic, checkOrder } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import styles from './index.module.scss'

function Home() {
  const { t } = useTranslation('common')
  const [ state ]  = useContext(ProfileContext)
  const isLogin = state.userInfo && state.userInfo.user_name
  // console.log('homepage state:', state)

  const [ feed, setFeed ] = useState('')
  const [ show, setShow ] = useState(false)
  const [ showSubscribe, setShowSubscribe ] = useState(false)
  const [ check, setCheck ] = useState(false)
  const defaultType = {
    type: 'topic',
    icon: 'oak-leaf',
    name: t('oak'),
    placeholder: t('oak_ph'),
  }
  const [ feedType, setFeedType ] = useState(defaultType)
  const [ feedInfo, setFeedInfo ] = useState({})
  const [ feedError, setFeedError ] = useState('')
  const [ monthlyPrice, setMonthlyPrice ] = useState(0)
  const [ yearlyPrice, setYearlyPrice ] = useState(0)
  const [ chargeCrypto, setChargeCrypto ] = useState({})
  const [ selectPeriod, setSelectPeriod ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ orderId, setOrderId ] = useState('')
  const [ intervalId, setIntervalId ] = useState(null)
  const [ followBtnText, setFollowBtnText ] = useState(t('follow'))
  const [ payUrl, setPayUrl ] = useState('')

  const prefix = (
    <Icon
      type="search"
      className={styles.searchIcon}
    />
  )

  const handleSearch = (val) => {
    if (!val) {
      setFeedInfo({})
      setFeedError('')
      setFollowBtnText(t('follow'))
    }
    setFeed(val)
  }

  const handleClear = () => {
    setFeedInfo({})
    setSelectPeriod('')
    setFeedError('')
    setFollowBtnText(t('follow'))
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
      setFeedError(error?.data?.message || 'parse_error')
      setLoading(false)
    }
  }

  const handleSubscribe = async (period) => {
    const params = {
      action: 'follow',
      tid: feedInfo.tid,
      period: period
    }
    try {
      const res = await subscribeTopic(params) || {}
      if (res?.payment_uri) {
        if (storageUtil.get('platform') === 'browser') {
          setPayUrl(res.payment_uri)
        } else {
          window.open(res.payment_uri)
        }
        setShowSubscribe(false)
        res?.order_id && setOrderId(res.order_id)
        setCheck(true)
      }
    } catch (error) {
      toast.error(error?.data.message || 'Failed')
    }
  }

  const inputValidate = (feed) => {
    const trimFeed = feed.trim()
    switch (feedType.type) {
      case 'rss':
        return (trimFeed.slice(0, 8) === 'https://' || trimFeed.slice(0, 7) === 'http://')
      case 'oak':
        return trimFeed.slice(0, 4) === 'oth:'
      case 'weibo':
        const wReg = new RegExp(/^[A-Za-z0-9_]{3,20}$/)
        return wReg.test(trimFeed)
      case 'twitter':
        const tReg = new RegExp(/^[A-Za-z0-9_]{4,15}$/)
        return tReg.test(trimFeed)
      default:
        return
    }
  }

  const handleParse = async (feed) => {
    setFeedInfo({})
    setFeedError('')
    setFollowBtnText(t('follow'))
    if (inputValidate(feed)) {
      setLoading(true)
      parseExternalFeed(feed)
    } else {
      setFeedError('validate_error')
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
    if (check) {
      const orderInterval = setInterval(async () => {
        const res = await checkOrder(orderId)
        if (res?.paid?.amount) {
          toast.success(t('subcribe_success'))
          setCheck(false)
          setOrderId('')
          setSelectPeriod('')
          setFollowBtnText(t('following'))
        }
      }, 3000)
      setIntervalId(orderInterval)
    } else {
      setOrderId('')
      intervalId && clearInterval(intervalId)
    }
  }, [check])

  return (
    <div className={styles.main}>
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
      <form className={styles.search} action=".">
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
      </form>

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
                {followBtnText}
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
        <div className={styles.errorInfo}>
          <Icon type="info-fill" />
          <p>
            {t('parse_error')}
          </p>
        </div>
      }

      {/* 搜索源选项 */}
      <FeedTypeSheet
        t={t}
        show={show}
        onClose={() => setShow(false)}
        feedOptions={feedOptions(t)}
        feedType={feedType}
        setFeedType={setFeedType}
        setFeedInfo={setFeedInfo}
        setFeedError={setFeedError}
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

      <Overlay
        t={t}
        desc={t('checking_pay')}
        visible={check}
        onCancel={() => setCheck(false)}
      />

      <QrCodeSheet
        t={t}
        show={payUrl}
        id={payUrl}
        onClose={() => {setPayUrl('')}}
        onCancel={() => {setPayUrl('')}}
        onConfirm={() => {setPayUrl('')}}
      />

      <OwlToast />

    </div>
  )
}

export default Home