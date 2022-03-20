import { useRouter } from 'next/router'
import Link from 'next/link'
import Icon from '../Icon'
import styles from './index.module.scss'

function BottomNav(props) {
  const { pathname, push } = useRouter()
  const list = [
    {
      href: '/discover',
      icon: 'apps',
      name: 'discover',
    },
    {
      href: '/',
      icon: 'robot',
      name: 'amos',
    },
    {
      href: '/user',
      icon: 'user',
      name: 'me',
    },
  ]

  return (
    <div className={styles.bottomNav}>
      <div>
        {
          list.map((item, idx) => (
            <div
              key={idx}
              className={`${pathname === item.href ? styles.active : styles.default}`}
              onClick={() => push(item.href)}
            >
              <Icon type={item.icon} />
              <p>{item.name}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default BottomNav