import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import TopBar from '../TopBar'
import Avatar from '../../widgets/Avatar'
import Icon from '../../widgets/Icon'
import { useRouter } from 'next/router'
import { getMixinContext } from '../../services/api/mixin'
import storageUtil from '../../utils/storageUtil'
import { checkGroup } from '../../services/api/owl'
import { ProfileContext } from '../../stores/useProfile'
import { authLogin } from '../../utils/loginUtil'
import styles from './index.module.scss'

function Layout(props) {
  const {
    children,
  } = props

  const { t } = useTranslation('common')
  const [ , dispatch ]  = useContext(ProfileContext)
  const { pathname, push } = useRouter()
  const [ theme, setTheme ] = useState('')
  const [ init, setInit ] = useState(false)
  const [ userInfo, setUserInfo ] = useState('')
  const [ groupInfo, setGroupInfo ] = useState(false)
  const isLogin = userInfo && userInfo.user_name

  const backLink = (path) => {
    switch (path) {
      case '/user':
        return '/'
      case '/settings':
        return '/user'
      default:
        break
    }
  }

  const avatarLink = (path) => {
    switch (path) {
      case '/':
        return '/user'
      case '/user':
        return '/settings'
      default:
        break
    }
  }

  const handleClick = () => {
    const link = avatarLink(pathname)
    if (link) {
      push(avatarLink(pathname))
    } else {
      return
    }
  }

  useEffect(() => {
    const ctx = getMixinContext()
    if (ctx?.locale && ctx.locale !== 'zh-CN') {
      i18n.changeLanguage('en')
      push(pathname, pathname, { locale: 'en' })
    }
    ctx.appearance && document.documentElement.setAttribute('data-theme', ctx.appearance)
    setTheme(ctx.appearance || 'light')

    if (!ctx?.app_version) {
      storageUtil.set('platform', 'browser')
    }

    // const conversation_id = ctx.conversation_id || '653f40a1-ea00-4a9c-8bb8-6a658025a90e'
    storageUtil.get(`user_info_${ctx?.conversation_id || ''}`) && setUserInfo(storageUtil.get(`user_info_${ctx?.conversation_id || ''}`))
    dispatch({
      type: 'userInfo',
      userInfo: storageUtil.get(`user_info_${ctx?.conversation_id || ''}`)
    })
    storageUtil.set('current_conversation_id', ctx?.conversation_id || null)
    // storageUtil.set('current_conversation_id', ctx?.conversation_id || 'e608b413-8ee9-426e-843e-77a3d6bb7cbc')

    if (ctx?.conversation_id) {
      const initialFunc = async () => {
        const data = await checkGroup({conversation_id: ctx.conversation_id})
        if (!data?.err_code) {
          setGroupInfo(data)
          dispatch({
            type: 'groupInfo',
            userInfo: data
          })
        }
      }
      initialFunc()
    }
    setInit(true)
  }, [])

  return (
    pathname !== '/callback/mixin' ?
    <div className={`${styles.wrap} ${pathname === '/' ? styles.bgLight : styles.bgGray}`}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <meta name="theme-color" content={ theme === 'dark' ? "#080808" : "#FFFFFF"} />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TopBar url={backLink(pathname)} />

      {/* 登录状态 */}
      <div className={styles.avatar}>
        <div>
          {
            pathname === '/user' &&
            <Icon
              type="settings-fill"
              onClick={() => push('/settings')}
            />
          }
          {
            init ?
              isLogin ?
              <Avatar
                group={groupInfo?.is_group}
                imgSrc={userInfo?.user_icon}
                onClick={handleClick}
              />
              :
              <div
                className={styles.login}
                onClick={() => authLogin()}
              >
                <span>
                  {groupInfo?.is_group ? t('owner_login') : t('login')}
                </span>
              </div>
            :
            <div style={{ height: '38px' }}></div>
          }
        </div>
      </div>
      {children}
    </div>
    :
    <div className={styles.callback}>
      {children}
    </div>
  )
}

export default Layout