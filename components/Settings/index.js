import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import styles from './index.module.scss'
import Icon from '../../widgets/Icon'
import Image from 'next/image'
import Head from 'next/head'
import TopBar from '../TopBar'
import Avatar from '../../widgets/Avatar'
import Collapse from '../../widgets/Collapse'
import BottomSheet from '../../widgets/BottomSheet'
import { useRouter } from 'next/router'
import storageUtil from '../../utils/storageUtil'
import { logout } from '../../utils/loginUtil'
import { ProfileContext } from '../../stores/useProfile'
import { getUserSettings, updateUserSettings } from '../../services/api/owl'

function Settings(props) {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [ state, dispatch ]  = useContext(ProfileContext)
  const [ userInfo, setUserInfo ] = useState('')
  const [ userUtc, setUserUtc ] = useState(8)
  const [ tempUtc, setTempUtc ] = useState(null)
  const [ utcShow, setUtcShow ] = useState(false)

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
    if (data?.utc.ok) {
      setUserUtc(tempUtc)
    } else {
      console.log('error')
    }
  }

  useEffect(async () => {
    const conversationId = storageUtil.get('current_conversation_id')
    const id = conversationId === null ? '' : conversationId
    storageUtil.get(`user_info_${id}`) && setUserInfo(storageUtil.get(`user_info_${id}`))
    handleUserSettings()
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <meta name="theme-color" content="#F4F6F7" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TopBar url="/user" />

      <div className={styles.avatar}>
        <Avatar group={userInfo?.user_type === 'MIXIN_GROUP'} imgSrc={userInfo?.user_icon} />
      </div>

      <div>
        <p className={styles.title}>
          # {t('settings')}
        </p>

        <div className={styles.card}>
          <p>
            <span>UTC {t('time')}{t('colon')}</span>
            <span>
              {t('current_utc')} - ({userUtc})
            </span>
          </p>
          <button className={styles.button} onClick={() => setUtcShow(true)}>
            {t('change')}
          </button>
        </div>

        <BottomSheet
          t={t}
          show={utcShow}
          onClose={() => {
            setUtcShow(false)
            setTempUtc(userUtc)
          }}
          withConfirm={true}
          confirmTitle={t('select_utc')}
          onCancel={() => {
            setUtcShow(false)
            setTempUtc(userUtc)
          }}
          onConfirm={() => {
            setUtcShow(false)
            handleUpdateSettings()
          }}
        >
          <div className={styles.sheet}>
            <div>
              <div className={styles.itemsGroup}>
                {
                  [...Array(24).keys()].map((item) => {
                    return (
                      <div
                        className={`${styles.item} ${(tempUtc ? item - 11 === tempUtc : item - 11 === userUtc) && styles.itemSelected}`}
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
          {t('logout')}
        </div>
      </div>
    </div>
  )
}

export default Settings