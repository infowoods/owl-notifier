import { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ProfileContext } from '../../stores/useProfile'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
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
  console.log('t:', t)
  console.log('t(test):', t('test'))
  const [ state ]  = useContext(ProfileContext)
  console.log('state at homepage:', state.profile)
  const [ userInfo, setUserInfo ] = useState('')
  const isLogin = state.profile.user_name !== undefined || userInfo.user_name
  console.log('user_info:', userInfo)

  const [ feed, setFeed ] = useState('')
  const [ show, setShow ] = useState(false)
  const [ showSubscribe, setShowSubscribe ] = useState(false)
  const [ subscribeTid, setSubscribeTid ] = useState('')
  const defaultType = {
    type: 'topic',
    icon: 'oak-leaf',
    name: 'Oak Topic',
    placeholder: 'Oak Topic name here...',
  }
  const [ feedType, setFeedType ] = useState(defaultType)
  const [ feedInfo, setFeedInfo ] = useState({})
  const [ loading, setLoading ] = useState(false)

  const feedOptions = [
    {
      type: 'topic',
      icon: 'oak-leaf',
      name: 'Oak Topic',
      // placeholder: 'Oak Topic name here...',
      placeholder: t('TEST'),
    },
    {
      type: 'rss',
      icon: 'rss',
      name: 'Feed URL',
      remark: 'Atom / RSS',
      placeholder: 'RSS feed url here...',
    },
    {
      type: 'weibo',
      icon: 'weibo-fill',
      name: 'Weibo',
      placeholder: 'Weibo id here...',
    },
    {
      type: 'twitter',
      icon: 'twitter-fill',
      name: 'Twitter',
      placeholder: 'Twitter username here...',
    },
    {
      type: 'youtube',
      icon: 'youtube-fill',
      name: 'YouTube',
      placeholder: 'YouTube id here...',
    }
  ]

  const subscribeOptions = [
    {
      period: 'month',
      price: '0.00000001'
    },
    {
      period: 'year',
      price: '0.000001'
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
    console.log('parse rss res:', res)
  }

  const parseInternalTopic = async (feed) => {
    const uri = 'oth:' + feedType.type + '/user/' + feed
    const params = {
      action: 'query',
      uri: uri,
    }
    const res = await parseTopic(params) || {}
    res?.tid && setFeedInfo(res)
    console.log('parse topic res:', res)
  }

  const handleSubscribe = async (period) => {
    const params = {
      action: 'follow',
      tid: subscribeTid,
      period: period
    }
    const res = await subscribeTopic(params) || {}
    // res?.tid && setFeedInfo(res)
    window.open(res.payment_uri)
    console.log('sub topic res:', res)
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

      {
        isLogin ?
        <div className={styles.avatar}>
          <Link href="/user" >
            <a>
              <Image
                src={state.profile.user_icon || userInfo.user_icon}
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
            Please Login
          </span>
        </div>
      }

      <div className={styles.options}>
        <span>Current Type:</span>
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

      <div className={styles.search}>
        <Input
          className={styles.input}
          prefix={prefix}
          placeholder={feedType.placeholder}
          value={feed}
          onChange={handleSearch}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      {
        loading ?
        <div className={styles.feedInfo}>
          <Loading size={30} className={styles.loading} />
          <span>
            Please wait, this may need some time...
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
              setSubscribeTid(feedInfo.tid)
              setShowSubscribe(true)
            }}
          >
            Follow
          </button>
        </div>
      }

      <BottomSheet
        show={show}
        onClose={() => setShow(false)}
      >
        <div
          className={styles.sheet}
        >
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

      <BottomSheet
        show={showSubscribe}
        onClose={() => setShowSubscribe(false)}
      >
        <div
          className={styles.sheet}
        >
          <p className={styles.optionsTitle}>
            Please select one of the plans:
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
                  <p>
                    {item.price} BTC / {item.period}
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

// export const getStaticProps = async ({ locale }) => ({
//   props: {
//     ...await serverSideTranslations(locale, ['common']),
//   },
// })

export default Home
// export default withTranslation("common")(Home)