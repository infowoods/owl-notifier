import Icon from '../Icon'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

const Checkbox = props => {
  const {
    className,
    value: checked,
    children,
    onChange,
    disabled,
    iconType,
    iconClass
  } = props

  const type = iconType ? iconType : (checked || disabled ? 'check' : 'uncheck')

  const handChange = () => {
    if (disabled) {
      return
    }
    onChange && onChange(!checked)
  }

  return (
    <div
      className={`${styles.checkbox} ${className} ${disabled && styles.disabled}`}
      onClick={handChange}
    >
      <Icon
        className={`${styles.iconCheck} ${checked && styles.checked} ${disabled && styles.disabled} ${iconClass}`}
        type={type}
      />
      {children}
    </div>
  )
}

Checkbox.propTypes = {
  className: PropTypes.string,
  value: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

Checkbox.defaultProps = {
  className: '',
}

export default Checkbox
