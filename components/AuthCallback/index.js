import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { ProfileContext } from '../../stores/useProfile'
import { owlSignIn } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'
import Head from 'next/head'
import styles from './index.module.scss'

function AuthCallback() {
  const [ error, setError ] = useState(false)
  const [ loading, setLoading ] = useState(true)
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
  // useEffect( async () => {
  //   setLoading(true)
  //   // const verifier = localStorage.getItem('code-verifier')
  //   try {
  //     console.log('try code:', query.code)
  //     const data = {
  //       code: query.code,
  //       conversation_id: '',
  //       // code_challenge: verifier
  //     }
  //     const profile = await owlSignIn(data)
  //     dispatch({
  //       type: 'profile',
  //       profile,
  //     })
  //     storageUtil.set('user_info', profile)
  //     push('/')
  //   } catch (error) {
  //     const errMsg = error.code || 'default error'
  //     error.code && setError(errMsg)
  //     console.log('errMsg:', errMsg)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [query])

  return (
    <div className={styles.main}>
      <Head>
        <title>Owl Deliver</title>
        <meta name="description" content="猫头鹰订阅器" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {
        error ?
        <p>
          授权失败 {error}
          <span onClick={() => push('/')}>
            : Back to homepage
          </span>
        </p>
        :
        null
      }
      {
        loading ?
        <div className={styles.loading}>
          <span className={styles.bar}>
            <span className={styles.progress}></span>
          </span>
        </div>
        :
        null
      }
    </div>
  )
}

export default AuthCallback