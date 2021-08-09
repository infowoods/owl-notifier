import styles from './index.module.scss'

function Loading({ size, className }) {
  return (
    <div className={`${styles.loading} ${className}`}>
      <div style={{ width: `${size}px`, height: `${size}px` }}>
      </div>
    </div>
  )
}

Loading.defaultProps = {
  size: 40
}

export default Loading