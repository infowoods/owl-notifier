import styles from './index.module.scss'

function ErrorMessage({ error, children }) {
  // const { className: clsn = '' } = children.props
  // console.log('clsn:', clsn)

  // // add errorBorder
  // if (error && (!/errorBorder/g.test(clsn))) {
  //   children.props.className = `${clsn} ${styles.errorBorder}`
  // }
  // if (error && children.props.type === 'select') {
  //   children.props.className = `${children.props.className} ${styles.errorBorder}`
  // }

  // // remove errorBorder
  // if (!error) {
  //   const newClsn = clsn.replace(/errorBorder/g, '')
  //   children.props.className = newClsn
  // }
  // if (!error && children.props.type === 'select') {
  //   const newClsn = clsn.replace(/errorBorder/g, '')
  //   children.props.className = newClsn
  // }

  return (
    <div className={styles.container}>
      {children}
      <div className={styles.errorMsg}>
        {error}
      </div>
    </div>
  )
}

export default ErrorMessage
