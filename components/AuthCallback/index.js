import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { ProfileContext } from '../../stores/useProfile'
import { owlSignIn } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import { getMixinContext } from '../../services/api/mixin'
import Head from 'next/head'
import styles from './index.module.scss'

function AuthCallback() {
  const { t } = useTranslation('common')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(true)
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
  useEffect( async () => {
    setLoading(true)
    // const verifier = localStorage.getItem('code-verifier')
    const conversation_id = ctx.conversation_id || ''
    // const conversation_id = ctx.conversation_id || '653f40a1-ea00-4a9c-8bb8-6a658025a90e' // 测试群组1
    // const conversation_id = ctx.conversation_id || 'e608b413-8ee9-426e-843e-77a3d6bb7cbc' // 测试群组2
    try {
      console.log('try code:', query.code)
      const params = {
        code: query.code,
        conversation_id: conversation_id,
        // code_challenge: verifier
      }
      const data = await owlSignIn(params) || {}
      console.log('auth data:', data)
      if (data?.access_token) {
        dispatch({
          type: 'profile',
          profile: data,
        })
        storageUtil.set(`user_info_${conversation_id}`, data)
        push('/')
      }
    } catch (error) {
      setLoading(false)
      error?.data?.message && setError(error?.data?.message)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    const res = getMixinContext()
    setCtx(res)
  }, [])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {
        error &&
        <div className={styles.error}>
          <p>
            {t('auth_failed')}{t('colon')}{error}
          </p>
          <p onClick={() => push('/')}>
            👉  {t('back_homepage')}
          </p>
        </div>
      }

      {
        loading &&
        <div className={styles.loading}>
          <span className={styles.bar}>
            <span className={styles.progress}></span>
          </span>
        </div>
      }
    </div>
  )
}

export default AuthCallback