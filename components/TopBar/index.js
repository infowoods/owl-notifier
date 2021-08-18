import styles from './index.module.scss'

function TopBar(props) {
  return (
    <div className={styles.bar}>
      <div className={styles.icon}>
        <img src="/favicon.png" />
        <span>Owl Deliver</span>
      </div>
    </div>
  )
}

export default TopBar