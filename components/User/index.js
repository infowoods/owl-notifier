import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ProfileContext } from '../../stores/useProfile'
import toast from 'react-hot-toast'
const OwlToast = dynamic(() => import('../../widgets/OwlToast'))
import Icon from '../../widgets/Icon'
import Loading from '../../widgets/Loading'
import { getFollows, unfollowFeeds, parseTopic, subscribeTopic, checkOrder } from '../../services/api/amo'
import storageUtil from '../../utils/storageUtil'
import { logout } from '../../utils/loginUtil'
import styles from './index.module.scss'

function User() {
  const { t } = useTranslation('common')
  const [ , dispatch ]  = useContext(ProfileContext)
  const router = useRouter()


  return (
    <div className={styles.main}>
      user
    </div>
  )
}

export default User