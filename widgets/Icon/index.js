import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function Icon(props) {
  const { type, className = '', ...others } = props

  return (
    <i className={`${styles.icon} ${className}`} {...others}>
      <svg className={styles.svg} aria-hidden="true">
        <use xlinkHref={`#${type}`} />
      </svg>
    </i>
  )
}

Icon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
}

export default Icon