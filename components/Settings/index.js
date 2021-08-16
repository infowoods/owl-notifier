import { useState, useEffect, useContext } from 'react'
import styles from './index.module.scss'
import Icon from '../../widgets/Icon'
import Image from 'next/image'
import Head from 'next/head'
import Collapse from '../../widgets/Collapse'
import { useRouter } from 'next/router'
import storageUtil from '../../utils/storageUtil'
import { logout } from '../../utils/loginUtil'
import { ProfileContext } from '../../stores/useProfile'
import { getUserSettings, updateUserSettings } from '../../services/api/owl'

function Settings(props) {
  const router = useRouter()
  const [ state, dispatch ]  = useContext(ProfileContext)
  const [ userInfo, setUserInfo ] = useState('')
  const [ userUtc, setUserUtc ] = useState(8)
  const localAvatar = userInfo.user_icon && userInfo.user_icon

  const handleUserSettings = async () => {
    const data = await getUserSettings()
    if (data) {
      data.utc && setUserUtc(data.utc)
    } else {
      console.log('error')
    }
  }

  const handleUpdateSettings = async (val) => {
    const params = { utc: val }
    const data = await updateUserSettings(params)
    if (data) {

    } else {
      console.log('error')
    }
  }

  useEffect(async () => {
    storageUtil.get('user_info') && setUserInfo(storageUtil.get('user_info'))
    handleUserSettings()
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className={styles.avatar}>
        <Icon
          type="arrow-right"
          onClick={() => {
            router.push('/user')
          }}
        />
        <Image
          src={state.profile.user_icon || localAvatar || '/xxx'}
          alt="avatar"
          width={35}
          height={35}
        />
      </div>

      <div>
        Settings

        <Collapse title="UTC time" remark={`Current is UTC-${userUtc}`}>
          {
            [...Array(24).keys()].map((item) => {
              return (
                <button
                  key={item}
                  className={`${styles.button} ${item - 11 === userUtc && styles.buttonSelected}`}
                  onClick={() => handleUpdateSettings(item - 11)}>
                  {item - 11}
                </button>
              )
            })
          }
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
    </div>
  )
}

export default Settings