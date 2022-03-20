import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { i18n } from 'next-i18next'
import { ProfileContext } from '../../stores/useProfile'
import { amoAuth, checkGroup } from '../../services/api/amo'
import storageUtil from '../../utils/storageUtil'
import { getMixinContext, getAccessToken } from '../../services/api/mixin'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
const OwlToast = dynamic(() => import('../../widgets/OwlToast'))
import styles from './index.module.scss'

function AuthCallback() {
  const [ ctx, setCtx ] = useState({})
  const [ , dispatch ]  = useContext(ProfileContext)
  const { push } = useRouter()
  const router = useRouter()

  const useQuery = () => {
    const hasQueryParams =
      /\[.+\]/.test(router.route) || /\?./.test(router.asPath)
    const ready = !hasQueryParams || Object.keys(router.query).length > 0
    if (!ready) return null
    return router.query
  }
  const query = useQuery()

  useEffect(() => {
    const conversation_id = ctx.conversation_id || ''

    const auth = async (token) => {
      try {
        const params = {
          mixin_access_token: token,
          conversation_id: conversation_id,
        }
        const data = await amoAuth(params)
        console.log('auth data:', data)
        if (data) {
          dispatch({
            type: 'userInfo',
            userInfo: data,
          })
          storageUtil.set(`user_info_${conversation_id}`, data) // userInfo persistence

          if (ctx?.locale && ctx.locale !== 'zh-CN' && i18n.language !== 'en') {
            i18n.changeLanguage('en')
            push('/', '/', { locale: 'en' })
          } else {
            push('/')
          }
        }
      } catch (error) {
        console.log('auth error:', error)
        toast.error('Auth Failed')
        // push('/')
      }
    }

    const getToken = async () => {
      const token = await getAccessToken(query.code)
      console.log('ttk:', token)
      token && auth(token)
    }

    query?.code && getToken()

  }, [query])

  // useEffect(() => {
  //   const res = getMixinContext()
  //   res && setCtx(res)
  //   if (res?.conversation_id) {
  //     const initialFunc = async () => {
  //       const data = await checkGroup({conversation_id: res.conversation_id})
  //       // const data = await checkGroup({conversation_id: 'e608b413-8ee9-426e-843e-77a3d6bb7cbc'})
  //       if (!data?.err_code) {
  //         dispatch({
  //           type: 'groupInfo',
  //           groupInfo: data
  //         })
  //         storageUtil.set(`group_info_${res.conversation_id}`, data) // groupInfo persistence
  //       }
  //     }
  //     initialFunc()
  //   }
  // }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Amo Notifier</title>
        <meta name="description" content="Amo" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <OwlToast />
    </div>
  )
}

export default AuthCallback