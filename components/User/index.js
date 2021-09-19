import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ProfileContext } from '../../stores/useProfile'
import Head from 'next/head'
import TopBar from '../TopBar'
import PriceSheet from '../Home/PriceSheet'
import { subscribeOptions } from '../Home/config'
import Icon from '../../widgets/Icon'
import Avatar from '../../widgets/Avatar'
import Collapse from '../../widgets/Collapse'
import Loading from '../../widgets/Loading'
import Overlay from '../../widgets/Overlay'
import { getFollows, unfollowFeeds, parseTopic, subscribeTopic, checkOrder } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import { convertTimestamp } from '../../utils/timeUtil'
import { logout } from '../../utils/loginUtil'
import styles from './index.module.scss'

function User() {
  const { t } = useTranslation('common')
  const [ state, dispatch ]  = useContext(ProfileContext)
  const router = useRouter()
  const [ empty, setEmpty ] = useState(false)
  const [ btnSelect, setBtnSelect ] = useState('')
  const [ userInfo, setUserInfo ] = useState('')
  const [ feedList, setFeedList ] = useState([])
  // const [ historyList, setHistoryList ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ showSubscribe, setShowSubscribe ] = useState(false)
  const [ chargeCrypto, setChargeCrypto ] = useState({})
  const [ selectPeriod, setSelectPeriod ] = useState('')
  const [ monthlyPrice, setMonthlyPrice ] = useState(0)
  const [ yearlyPrice, setYearlyPrice ] = useState(0)
  const [ refollowId, setRefollowId ] = useState('')
  const [ orderId, setOrderId ] = useState('')
  const [ check, setCheck ] = useState(false)
  const [ intervalId, setIntervalId ] = useState(null)

  const renderReason = (val) => {
    if (val === 'cancel') {
      return t('manual_cancel')
    }
    else if (val === 'expired') {
      return t('feed_expired')
    }
  }

  const handleUnfollow = async (params) => {
    try {
      const res = await unfollowFeeds(params)
      if (res.topic_id) {
        setBtnSelect('')
        getUserFollows()
      }
    } catch (error) {
      if (error?.data?.action === 'logout') {
        logout(dispatch)
        router.push('/')
      }
    }
  }

  const getUserFollows = async () => {
    try {
      const followsList = await getFollows()
      if (followsList.utc_offset) {
        setFeedList(followsList.follows)
        setLoading(false)
      } else {
        console.log('error')
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      if (error?.data?.message === 'no user data') {
        setEmpty(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefollow = async (tid) => {
    const params = {
      action: 'query',
      tid: tid,
    }
    try {
      const res = await parseTopic(params) || {}
      if (res?.price) {
        const monPrice = (Number(res.price.monthly) + Number(res.service_charge.monthly)).toFixed(8).replace(/\.?0+$/,"")
        const yearPrice = (Number(res.price.yearly) + Number(res.service_charge.yearly)).toFixed(8).replace(/\.?0+$/,"")
        setMonthlyPrice(monPrice)
        setYearlyPrice(yearPrice)
        setChargeCrypto(res.service_charge.currency)
        setBtnSelect('')
        setShowSubscribe(true)
      }
    } catch (error) {}
  }

  const handleSubscribe = async (period) => {
    const params = {
      action: 'follow',
      tid: refollowId,
      period: period
    }
    const res = await subscribeTopic(params) || {}
    if (res?.payment_uri) {
      window.open(res.payment_uri)
      setShowSubscribe(false)
      res?.order_id && setOrderId(res.order_id)
      setCheck(true)
    }
  }

  useEffect(() => {
    if (check) {
      const orderInterval = setInterval(async () => {
        const res = await checkOrder(orderId)
        if (res?.paid?.amount) {
          setCheck(false)
          setOrderId('')
          setSelectPeriod('')
          getUserFollows()
        }
      }, 3000)
      setIntervalId(orderInterval)
    } else {
      setOrderId('')
      intervalId && clearInterval(intervalId)
    }
  }, [check])

  useEffect(() => {
    const conversationId = storageUtil.get('current_conversation_id')
    const id = conversationId === null ? '' : conversationId
    storageUtil.get(`user_info_${id}`) && setUserInfo(storageUtil.get(`user_info_${id}`))
    getUserFollows()
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <meta name="theme-color" content={ state.ctx?.appearance === 'dark' ? "#1E1E1E" : "#F4F6F7"} />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TopBar url="/" />

      <div className={styles.avatar}>
        <div>
          <Icon
            type="settings-fill"
            onClick={() => {
              router.push('/settings')
            }}
          />
          <Avatar group={userInfo?.user_type === 'MIXIN_GROUP'} imgSrc={userInfo?.user_icon} />
        </div>
      </div>

      {
        empty &&
        <div className={styles.empty}>
          <Icon type="ufo" />
          <p>{t('no_records')}</p>
        </div>
      }

      {
        loading ?
          <Loading size={40} className={styles.loading} />
          :
        <>
          {
            feedList?.ing && feedList?.ing.length > 0 && <p className={styles.sectionTitle}># {t('following')}</p>
          }
          {
            feedList?.ing && feedList.ing.map((feed, index) => {
              const params = {
                topic_id: feed.tid
              }
              return (
                <Collapse title={feed.title} key={feed.tid + index}>
                  <>
                    {
                      feed.desc &&
                      <p className={styles.feedDesc}>
                        <span>{t('desc')}{t('colon')}</span>
                        {feed.desc}
                      </p>
                    }
                    <div className={`${styles.detail} ${feed.desc && styles.increaseMargin}`}>
                      <p>
                        <span>{t('expire_date')}{t('colon')}</span>
                        {convertTimestamp(feed.expire_ts, 8)}
                      </p>
                      <button
                        className={styles.button}
                        onClick={() => {
                          setBtnSelect(index + 'unfollow')
                          handleUnfollow(params)
                        }}
                      >
                        {
                          btnSelect === index + 'unfollow' ?
                          <Loading size={18} className={styles.btnLoading} />
                          :
                          t('unfollow')
                        }
                      </button>
                    </div>
                  </>
                </Collapse>
              )
            })
          }

          {
            feedList?.history && feedList?.history.length > 0 && <p className={styles.sectionTitle}># {t('history')}</p>
          }
          {
            feedList?.history && feedList?.history.map((feed, index) => {
              return (
                <Collapse title={feed.title} key={feed.tid + index}>
                  <>
                    {
                      feed.desc &&
                      <p className={styles.feedDesc}>
                        <span>{t('desc')}{t('colon')}</span>
                        {feed.desc}
                      </p>
                    }
                    <div className={`${styles.detail} ${feed.desc && styles.increaseMargin}`}>
                      <p>
                        <span>{t('unfollow_reason')}{t('colon')}</span>
                        {renderReason(feed.reason)}
                      </p>
                      <button
                        className={`${styles.button} ${styles.buttonAccent}`}
                        onClick={() => {
                          setBtnSelect(index + 'refollow')
                          handleRefollow(feed.tid)
                          setRefollowId(feed.tid)
                        }}
                      >
                        {
                          btnSelect === index + 'refollow' ?
                          <Loading size={18} className={styles.btnLoading} />
                          :
                          t('refollow')
                        }
                      </button>
                    </div>
                  </>
                </Collapse>
              )
            })
          }
        </>
      }

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

    </div>
  )
}

export default User