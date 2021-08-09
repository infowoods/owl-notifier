import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { ProfileContext } from '../../stores/useProfile'
import { owlSignIn } from '../../services/api/owl'
import storageUtil from '../../utils/storageUtil'

function AuthCallback() {
  const [ error, setError ] = useState(false)
  const [ loading, setLoading ] = useState(false)
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
    try {
      console.log('try code:', query.code)
      const data = {
        code: query.code,
        conversation_id: '',
        // code_challenge: verifier
      }
      const profile = await owlSignIn(data)
      console.log('me res:', profile)
      dispatch({
        type: 'profile',
        profile,
      })
      storageUtil.set('user_info', profile)
      push('/')
    } catch (error) {
      const errMsg = error.code || 'default error'
      error.code && setError(errMsg)
      console.log('errMsg:', errMsg)
    } finally {
      setLoading(false)
    }
  }, [query])

  return (
    <div>
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
        <p>Loading...</p>
        :
        null
      }
    </div>
  )
}

export default AuthCallback