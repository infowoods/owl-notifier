import { useEffect } from 'react'
import Loading from '../Loading'
import styles from './index.module.scss'

function Overlay(props) {
  const { t, visible, desc, onCancel } = props

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [visible])

  return (
    visible &&
    <div className={styles.overlay}>
      <Loading size={32} className={styles.loading} />
      <p>
        {desc}
      </p>
      <button onClick={onCancel}>
        {t('cancel')}
      </button>
    </div>
  )
}

export default Overlay