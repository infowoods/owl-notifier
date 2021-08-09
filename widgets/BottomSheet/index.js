import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import styles from './index.module.scss'

function BottomSheet(props) {
  const {
    className,
    show,
    onClose,
    children
  } = props

  const handleOnClose = (e) => {
    onClose && onClose(e)
  }

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  return (
    show &&
    <div
      className={`${styles.overlay} ${className}`}
      onClick={handleOnClose}
    >
      <div
        className={styles.sheet}
        onClick={(e) => { e.stopPropagation() }}
      >
        {children}
      </div>
    </div>
  )
}

BottomSheet.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  content: PropTypes.element,
}

BottomSheet.defaultProps = {
  className: '',
  onClose: () => {},
}

export default BottomSheet