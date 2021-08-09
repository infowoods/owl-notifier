import { useState } from 'react'
import Icon from '../Icon'
import styles from './index.module.scss'

function Collapse(props) {
  const {
    className,
    title,
    // active,
    children,
  } = props

  const [ active, setActive ] = useState(false)

  return (
    <div className={`${styles.collapse} ${className}`}>
      <div className={styles.card} onClick={() => setActive(!active)}>
        <div>{title}</div>
        <Icon
          type="arrow-right"
          className={styles.arrow}
        />
      </div>
      {
        active &&
        <div>
          {children}
        </div>
      }
    </div>
  )
}

export default Collapse