import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { i18n } from 'next-i18next'
import { ProfileContext } from '../../stores/useProfile'
import { owlSignIn, checkGroup } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import { getMixinContext } from '../../services/api/mixin'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
const OwlToast = dynamic(() => import('../../widgets/OwlToast'))
import styles from './index.module.scss'

function AuthCallback() {
  // const [ loading, setLoading ] = useState(true)
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
    // const conversation_id = ctx.conversation_id || '653f40a1-ea00-4a9c-8bb8-6a658025a90e' // 测试群组1
    // const conversation_id = ctx.conversation_id || 'e608b413-8ee9-426e-843e-77a3d6bb7cbc' // 测试群组2
    // setLoading(true)
    const conversation_id = ctx.conversation_id || ''

    const auth = async () => {
      try {
        const params = {
          code: query.code,
          conversation_id: conversation_id,
        }
        const data = await owlSignIn(params) || {}
        if (data?.access_token) {
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
        // setLoading(false)
        toast.error('Auth Failed')
        push('/')
      } finally {
        // setLoading(false)
      }
    }
    query?.code && auth()
  }, [query])

  useEffect(() => {
    const res = getMixinContext()
    res && setCtx(res)
    if (res?.conversation_id) {
      const initialFunc = async () => {
        const data = await checkGroup({conversation_id: res.conversation_id})
        // const data = await checkGroup({conversation_id: 'e608b413-8ee9-426e-843e-77a3d6bb7cbc'})
        if (!data?.err_code) {
          dispatch({
            type: 'groupInfo',
            groupInfo: data
          })
          storageUtil.set(`group_info_${res.conversation_id}`, data) // groupInfo persistence
        }
      }
      initialFunc()
    }
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* {
        loading &&
        <div className={styles.loading}>
          <span className={styles.bar}>
            <span className={styles.progress}></span>
          </span>
        </div>
      } */}

      <OwlToast />
    </div>
  )
}

export default AuthCallback