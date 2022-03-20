import Loading from '../Loading'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function Button(props) {
  const {
    className,
    children,
    type,
    size,
    disabled,
    loading,
    withArrow,
    prefix,
    suffix,
    ...others
  } = props

  console.log(type)

  return (
    <button
      className={`${styles.button} ${styles[type]} ${styles[size]} ${loading && styles[loading]} ${className}`}
      disabled={disabled}
      {...others}
    >
      {children}

      {
        loading &&
        <Loading />
      }
    </button>
  )
}

Button.defaultProps = {
  type: 'primary',
  size: 'small',
  loading: false,
  disabled: false,
  withArrow: false,
}

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'floating', 'secondary', 'text']),
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  withArrow: PropTypes.bool,
  suffix: PropTypes.node,
  prefix: PropTypes.node,
}

export default Button