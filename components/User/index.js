import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ProfileContext } from '../../stores/useProfile'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import TopBar from '../TopBar'
import Icon from '../../widgets/Icon'
import Collapse from '../../widgets/Collapse'
import Loading from '../../widgets/Loading'
import { getFollows, unfollowFeeds } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import { convertTimestamp } from '../../utils/timeUtil'
import styles from './index.module.scss'

function User(props) {
  const { t } = useTranslation('common')
  const [ state, dispatch ]  = useContext(ProfileContext)
  const router = useRouter()
  const [ userInfo, setUserInfo ] = useState('')
  const [ feedList, setFeedList ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const localAvatar = userInfo.user_icon && userInfo.user_icon

  const handleUnfollow = (params) => {
    const res = unfollowFeeds(params)
    if (res.data) {
      getUserFollows()
    }
  }

  const getUserFollows = async () => {
    const followsList = await getFollows()
    if (followsList.utc_offset) {
      setFeedList(followsList.follows)
      setLoading(false)
    } else {
      console.log('error')
      setLoading(false)
    }
  }

  useEffect(async () => {
    storageUtil.get('user_info') && setUserInfo(storageUtil.get('user_info'))
    getUserFollows()
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <meta name="theme-color" content="#F4F6F7" />
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
          <Image
            src={state.profile.user_icon || localAvatar || '/xxx'}
            alt="avatar"
            width={35}
            height={35}
          />
        </div>
      </div>

      {
        loading ?
          <Loading size={40} className={styles.loading} />
          :
        <>
          {
            feedList.ing && <p className={styles.sectionTitle}>{t('following')}</p>
          }
          {
            feedList.ing && feedList.ing.map((feed) => {
              const params = {
                action: 'unfollows',
                tids: [`${feed.tid}`]
              }
              return (
                <Collapse title={feed.title} key={feed.tid}>
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
                      <button className={styles.button} onClick={() => handleUnfollow(params)}>
                        {t('unfollow')}
                      </button>
                    </div>
                  </>
                </Collapse>
              )
            })
          }

          {
            feedList.history && <p className={styles.sectionTitle}>{t('history')}</p>
          }
          {
            feedList.history && feedList.history.map((feed) => {
              const params = {
                action: 'unfollows',
                tids: [`${feed.tid}`]
              }
              return (
                <Collapse title={feed.title} key={feed.tid}>
                  <>
                    {
                      feed.desc &&
                      <p>
                        <span>{t('desc')}{t('colon')}</span>
                        {feed.desc}
                      </p>
                    }
                    <div className={styles.detail}>
                      <p>
                        <span>{t('unfollow_reason')}{t('colon')}</span>
                        {feed.reason}
                      </p>
                      <button className={styles.button} onClick={() => handleUnfollow(params)}>
                        {t('refollow')}
                      </button>
                    </div>
                  </>
                </Collapse>
              )
            })
          }
        </>
      }
    </div>
  )
}

export default User