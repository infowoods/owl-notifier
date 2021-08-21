import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import styles from './index.module.scss'

function BottomSheet(props) {
  const {
    className,
    show,
    withConfirm,
    onCancel,
    onConfirm,
    confirmTitle,
    confirmText,
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
        {
          withConfirm &&
          <div className={styles.sheetTitle}>
            <div onClick={() => onCancel()}>
              取 消
            </div>
            <div>{confirmTitle}</div>
            <div onClick={() => onConfirm()}>
              {confirmText ? confirmText : '确 认'}
            </div>
          </div>
        }
        {children}
      </div>
    </div>
  )
}

BottomSheet.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
}

BottomSheet.defaultProps = {
  className: '',
  onClose: () => {},
}

export default BottomSheet