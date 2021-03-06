import { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProfileContext } from '../../stores/useProfile'
import toast from 'react-hot-toast'
const OwlToast = dynamic(() => import('../../widgets/OwlToast'))
const Overlay = dynamic(() => import('../../widgets/Overlay'))
const QrCodeSheet = dynamic(() => import('./QrCodeSheet'))
const PriceSheet = dynamic(() => import('./PriceSheet'))
const FeedTypeSheet = dynamic(() => import('./FeedTypeSheet'))
import Icon from '../../widgets/Icon'
import Tooltip from '../../widgets/Tooltip'
import Input from '../../widgets/Input'
import Loading from '../../widgets/Loading'
import { feedOptions, subscribeOptions } from './config'
import { authLogin, logout } from '../../utils/loginUtil'
import { formatNum, formatAdd } from '../../utils/numberUtil'
import { parseFeed, subscribeTopic, checkOrder } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import styles from './index.module.scss'

function Home() {
  const { t } = useTranslation('common')
  const [state, dispatch] = useContext(ProfileContext)
  const isLogin = state.userInfo && state.userInfo.user_name
  // console.log('homepage state:', state)

  const [feed, setFeed] = useState('')
  const [show, setShow] = useState(false)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [check, setCheck] = useState(false)
  const defaultType = {
    type: 'oak',
    icon: 'oak-leaf',
    name: t('oak'),
    placeholder: t('oak_ph'),
  }
  const [feedType, setFeedType] = useState(defaultType)
  const [feedInfo, setFeedInfo] = useState({})
  const [feedError, setFeedError] = useState('')
  const [monthlyPrice, setMonthlyPrice] = useState(0)
  const [yearlyPrice, setYearlyPrice] = useState(0)
  const [monthHubPrice, setMonthHubPrice] = useState(0)
  const [yearHubPrice, setYearHubPrice] = useState(0)
  const [monthPushPrice, setMonthPushPrice] = useState(0)
  const [yearPushPrice, setYearPushPrice] = useState(0)
  const [chargeCrypto, setChargeCrypto] = useState({})
  const [selectPeriod, setSelectPeriod] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [intervalId, setIntervalId] = useState(null)
  const [followBtnText, setFollowBtnText] = useState(t('follow'))
  const [payUrl, setPayUrl] = useState('')

  const prefix = <Icon type="search" className={styles.searchIcon} />

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
    let parseUrl
    switch (feedType.type) {
      case 'rss':
        parseUrl = feed
        break
      case 'oak':
        parseUrl = feed
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
      uri: parseUrl,
    }
    try {
      const res = await parseFeed(params)
      if (res?.price) {
        setFeedInfo(res)
        const monPrice = formatAdd(
          res.price.monthly,
          res.service_charge.monthly
        )
        const yearPrice = formatAdd(res.price.yearly, res.service_charge.yearly)
        setMonthlyPrice(monPrice)
        setYearlyPrice(yearPrice)
        setMonthHubPrice(formatNum(res.price.monthly))
        setYearHubPrice(formatNum(res.price.yearly))
        setMonthPushPrice(formatNum(res.service_charge.monthly))
        setYearPushPrice(formatNum(res.service_charge.yearly))
        setChargeCrypto(res.service_charge.currency)
        setLoading(false)
      }
    } catch (error) {
      if (error?.action === 'logout') {
        toast.error(t('auth_expire'))
        setLoading(false)
        logout(dispatch)
        return
      }
      setFeedError(error?.data?.message || `${feedType.type}_parse_error`)
      setLoading(false)
    }
  }

  const handleSubscribe = async (period) => {
    const params = {
      action: 'follow',
      tid: feedInfo.tid,
      period: period,
    }
    try {
      const res = (await subscribeTopic(params)) || {}
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
        return (
          trimFeed.slice(0, 8) === 'https://' ||
          trimFeed.slice(0, 7) === 'http://'
        )
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
      setFeedError(`${feedType.type}_validate_error`)
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
      {/* ?????????????????? */}
      <div className={styles.options}>
        <span>
          {t('current_type')}
          {t('colon')}
        </span>
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

      {/* ????????? */}
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

      <Link href="/hot-topics">
        <a className={styles.hot}>{t('hot_now')} ??????</a>
      </Link>

      {/* ???????????????????????? */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <Loading size={30} className={styles.loading} />
          <span className={styles.loadingHint}>{t('loading_hint')}</span>
        </div>
      ) : (
        feedInfo?.tid && (
          <>
            <div className={styles.feedInfo}>
              <div className={styles.feedDesc}>
                <div>
                  <p>{feedInfo.title}</p>
                  {feedInfo.desc && (
                    <p>
                      {t('desc')}
                      {t('colon')}
                      {feedInfo.desc}
                    </p>
                  )}
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
              <p>
                {t('subcribe_price')}
                <span>
                  {t('price_desc')}
                  {t('colon')}
                </span>
              </p>
              <div>
                <Tooltip
                  position="center"
                  theme="dark"
                  content={
                    <span className={styles.help}>
                      {monthHubPrice} {chargeCrypto.symbol} + {monthPushPrice}{' '}
                      {chargeCrypto.symbol}
                    </span>
                  }
                >
                  <p>
                    {monthlyPrice} {chargeCrypto.symbol} / {t('month')}
                    <Icon type="help-fill" />
                  </p>
                </Tooltip>
                <div className={styles.divider}></div>
                <Tooltip
                  position="center"
                  theme="dark"
                  content={
                    <span className={styles.help}>
                      {yearHubPrice} {chargeCrypto.symbol} + {yearPushPrice}{' '}
                      {chargeCrypto.symbol}
                    </span>
                  }
                >
                  <p>
                    {yearlyPrice} {chargeCrypto.symbol} / {t('year')}
                    <Icon type="help-fill" />
                  </p>
                </Tooltip>
              </div>
            </div>
          </>
        )
      )}

      {/* ???????????? */}
      {feedError && (
        <div className={styles.errorInfo}>
          <Icon type="info-fill" />
          <p>{feedError.indexOf(' ') >= 0 ? feedError : t(feedError)}</p>
        </div>
      )}

      {/* ??????????????? */}
      <FeedTypeSheet
        t={t}
        show={show}
        onClose={() => setShow(false)}
        feedOptions={feedOptions(t)}
        feedType={feedType}
        setFeedType={setFeedType}
        setFeedInfo={setFeedInfo}
        setFeedError={setFeedError}
        setShow={setShow}
      />

      {/* ?????????????????? */}
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
        onClose={() => {
          setPayUrl('')
        }}
        onCancel={() => {
          setPayUrl('')
        }}
        onConfirm={() => {
          setPayUrl('')
        }}
      />

      <OwlToast />
    </div>
  )
}

export default Home
