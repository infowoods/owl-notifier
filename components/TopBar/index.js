import { useRouter } from 'next/router'
import Icon from '../../widgets/Icon'
import styles from './index.module.scss'

function TopBar(props) {
  const { url } = props
  const router = useRouter()

  return (
    <div className={styles.bar}>
      {
        url &&
        <Icon
          className={styles.back}
          type="arrow-right"
          onClick={() => {
            router.push(url)
          }}
        />
      }
      <div className={`${styles.icon} ${url && styles.iconPadding}`}>
        <img src="/favicon.png" />
        <span>Owl Deliver</span>
      </div>
    </div>
  )
}

export default TopBar