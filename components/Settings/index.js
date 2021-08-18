import { useState, useEffect, useContext } from 'react'
import styles from './index.module.scss'
import Icon from '../../widgets/Icon'
import Image from 'next/image'
import Head from 'next/head'
import TopBar from '../TopBar'
import Collapse from '../../widgets/Collapse'
import BottomSheet from '../../widgets/BottomSheet'
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
  const [ tempUtc, setTempUtc ] = useState(8)
  const [ utcShow, setUtcShow ] = useState(false)
  const [ select, setSelect ] = useState(false)
  const localAvatar = userInfo.user_icon && userInfo.user_icon

  const handleUserSettings = async () => {
    const data = await getUserSettings()
    if (data) {
      data.utc && setUserUtc(data.utc) && setTempUtc(data.utc)
    } else {
      console.log('error')
    }
  }

  const handleUpdateSettings = async () => {
    const params = { utc: tempUtc }
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

      <TopBar />

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
        <p className={styles.title}>
          Settings
        </p>

        <div className={styles.card}>
          <p>
            <span>UTC Time:</span>
            <span>
              Current is UTC-{userUtc}
            </span>
          </p>
          <button className={styles.button} onClick={() => setUtcShow(true)}>
            change
          </button>
        </div>

        <BottomSheet show={utcShow} onClose={() => {
          setUtcShow(false)
          setTempUtc(userUtc)
        }}>
          <div className={styles.sheet}>
            <div>
              <div className={styles.sheetTitle}>
                <div onClick={() => {
                  setUtcShow(false)
                  setTempUtc(userUtc)
                }}>
                  取 消
                </div>
                <div>选择 UTC 时区</div>
                <div onClick={() => {
                  setUtcShow(false)
                  handleUpdateSettings()
                }}>
                  确 认
                </div>
              </div>
              <div className={styles.itemsGroup}>
                {
                  [...Array(24).keys()].map((item) => {
                    return (
                      <div
                        className={`${styles.item} ${item - 11 === tempUtc && styles.itemSelected}`}
                        key={item}
                        onClick={() => {
                          setTempUtc(item - 11)
                        }}
                      >
                        <div>UTC</div>
                        <div>{item - 11}</div>
                        <div></div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </BottomSheet>

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