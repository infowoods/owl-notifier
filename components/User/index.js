import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { ProfileContext } from '../../stores/useProfile'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '../../widgets/Icon'
import Collapse from '../../widgets/Collapse'
import Loading from '../../widgets/Loading'
import { getFollows, unfollowFeeds } from '../../services/api/owl'
import { logout } from '../../utils/loginUtil'
import storageUtil from '../../utils/storageUtil'
import styles from './index.module.scss'

function User(props) {
  const [ state, dispatch ]  = useContext(ProfileContext)
  const router = useRouter()
  const [ userInfo, setUserInfo ] = useState('')
  const [ feedList, setFeedList ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ buttonStatus, setButtonStatus ] = useState('unfollow')
  const localAvatar = userInfo.user_icon && userInfo.user_icon

  const handleUnfollow = (params) => {
    const res = unfollowFeeds(params)
    if (res.data) {
      getUserFollows()
    }
  }

  const getUserFollows = async () => {
    const followsList = await getFollows()
    setFeedList(followsList.follows)
    setLoading(false)
    console.log('followsList:', followsList)
  }

  useEffect(async () => {
    storageUtil.get('user_info') && setUserInfo(storageUtil.get('user_info'))
    console.log(storageUtil.get('user_info'))
    getUserFollows()
  }, [])

  // useEffect(() => {
  //   getUserFollows()
  // }, [feedList])

  return (
    <div className={styles.main}>
      <div className={styles.avatar}>
        <Icon
          type="arrow-right"
          onClick={() => {
            console.log('back to home')
            router.push('/')
          }}
        />
        <Image
          src={state.profile.user_icon || localAvatar || '/xxx'}
          alt="avatar"
          width={35}
          height={35}
        />
      </div>
      <p>Following</p>
      {
        loading ?
        <Loading size={40} />
        :
        feedList.ing && feedList.ing.map((feed) => {
          const params = {
            action: 'unfollows',
            tids: [`${feed.tid}`]
          }
          return (
            <div className={styles.feed} key={feed.tid}>
              <span>{feed.title}</span>
              <button onClick={() => handleUnfollow(params)}>
                {buttonStatus}
              </button>
            </div>
          )
        })
      }
      <p>History</p>
      {
        feedList.history && feedList.history.map((feed) => {
          const params = {
            action: 'unfollows',
            tids: [`${feed.tid}`]
          }
          return (
            <div className={styles.feed} key={feed.tid}>
              <span>{feed.title}</span>
              <button onClick={() => handleUnfollow(params)}>
                {buttonStatus}
              </button>
            </div>
          )
        })
      }
      {/* <div className={styles.feed}>
        <span>Cedric Fung’s blog</span>
        <button>unfollow</button>
      </div> */}
      <Collapse
        title="Title"
      >
        <div>
          details
        </div>
      </Collapse>
      <div
        className={styles.logout}
        onClick={() => {
          logout(dispatch)
          router.push('/')
        }}
      >
        Logout
      </div>
    </div>
  )
}

export default User