import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ProfileContext } from '../../stores/useProfile'
import toast from 'react-hot-toast'
import Icon from '../../widgets/Icon'
import Loading from '../../widgets/Loading'
import { feedOptions, subscribeOptions } from './config'
import { authLogin, logout } from '../../utils/loginUtil'
import { formatNum, formatAdd } from '../../utils/numberUtil'
import { getAmoList } from '../../services/api/amo'
import storageUtil from '../../utils/storageUtil'
import styles from './index.module.scss'

function Amos() {
  const { t } = useTranslation('common')
  const [ state, dispatch ]  = useContext(ProfileContext)
  const isLogin = state.userInfo && state.userInfo.user_name
  const { push } = useRouter()

  const [ list, setList ] = useState([])
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    console.log('state:', state)
    const getList = async () => {
      const data = await getAmoList()
      console.log('amo data:', data)
      setLoading(false)
      setList(data)
    }

    if (isLogin) {
      getList()
      console.log(',')
    } else {
      console.log('not login')
      setLoading(false)
    }
  }, [])


  return (
    <div className={styles.main}>
      <div className={styles.add} onClick={() => push('amos/add')}>
        <Icon type="add" />
      </div>
      {
        loading ?
          <Loading />
          :
          list && list.map((item, idx) => (
            <div
              key={idx}
              className={styles.card}
              onClick={() => push(`/amos/${item.id}`)}
            >
              <div>
                <p>{item.profile.title}</p>
                <p>{item.profile.description}</p>
              </div>
              <Icon type="arrow-right" />
            </div>
          ))
      }
    </div>
  )
}

export default Amos