import { useState, useEffect, useContext } from 'react'
import { i18n, useTranslation } from 'next-i18next'
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

function Layout({ children }) {
  const { t } = useTranslation('common')
  const [ state, dispatch ]  = useContext(ProfileContext)
  const { pathname, push } = useRouter()
  const [ theme, setTheme ] = useState('')
  const [ init, setInit ] = useState(false)
  const isLogin = state.userInfo && state.userInfo.user_name

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
    // console.log('>>> layout init:', pathname)
    const ctx = getMixinContext()
    if (ctx?.locale && ctx.locale !== 'zh-CN' && i18n.language !== 'en' && pathname !== '/callback/mixin') {
      i18n.changeLanguage('en')
      push(pathname, pathname, { locale: 'en' })
      return
    }

    ctx.appearance && document.documentElement.setAttribute('data-theme', ctx.appearance)
    // document.documentElement.setAttribute('data-theme', 'dark')
    setTheme(ctx.appearance || 'light')

    if (!ctx?.app_version) {
      storageUtil.set('platform', 'browser')
    }

    // const conversation_id = ctx.conversation_id || '653f40a1-ea00-4a9c-8bb8-6a658025a90e'
    storageUtil.get(`user_info_${ctx?.conversation_id || ''}`) && dispatch({
      type: 'userInfo',
      userInfo: storageUtil.get(`user_info_${ctx?.conversation_id || ''}`)
    })

    storageUtil.set('current_conversation_id', ctx?.conversation_id || null)
    // storageUtil.set('current_conversation_id', ctx?.conversation_id || 'e608b413-8ee9-426e-843e-77a3d6bb7cbc')

    if (ctx?.conversation_id) {
      const initialFunc = async () => {
        const data = await checkGroup({conversation_id: ctx.conversation_id})
        // const data = await checkGroup({conversation_id: '653f40a1-ea00-4a9c-8bb8-6a658025a90e'})
        if (!data?.err_code) {
          dispatch({
            type: 'groupInfo',
            groupInfo: data
          })
          console.log('>> refesh in mixin init')
          setInit(true)
        }
      }
      initialFunc()
    } else {
      console.log('>> refesh desktop init')
      setInit(true)
    }
  }, [])

  return (
    (pathname !== '/callback/mixin' && pathname !== '/_error') ?
    <div className={`${styles.wrap} ${pathname === '/' ? styles.bgLight : styles.bgGray}`}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <meta
          name="theme-color"
          content={
            theme === 'dark' ?
            (pathname === '/' ? "#080808" : "#1E1E1E")
            :
            (pathname === '/' ? "#FFFFFF" : "#F4F6F7")
          }
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TopBar url={backLink(pathname)} />

      {/* 登录状态 */}
      <div className={styles.avatarWrap}>
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
              <div className={styles.avatar}>
                <Avatar
                  group={state.groupInfo?.is_group}
                  imgSrc={state.userInfo?.user_icon}
                  onClick={handleClick}
                />
              </div>
              :
              <div
                className={styles.login}
                onClick={() => authLogin()}
              >
                <span>
                  {
                    state.groupInfo?.is_group ?
                    t('owner_login') : t('login')
                  }
                </span>
              </div>
            :
            <div style={{ height: '40px' }}></div>
          }
        </div>
      </div>
      {init && children}
    </div>
    :
    <div className={styles.noTopBar}>
      {children}
    </div>
  )
}

export default Layout