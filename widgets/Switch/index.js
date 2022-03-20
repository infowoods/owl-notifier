import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function Switch(props) {
  const { onChange, loading, control, disabled } = props
  const [ checked, setChecked ] = useState(false)

  useEffect(() => {
    setChecked(props.value)
  }, [props.value])

  const handleClick = () => {
    if (loading || disabled) return
    if (control) {
      onChange?.(!checked)
      return
    }
    setChecked(!checked)
    onChange?.(!checked)
  }

  return (
    <div
      className={`${styles.switch} ${checked ? styles.checked : styles.notChecked} ${disabled && styles.disabled}`}
      onClick={handleClick}
    >
      <div className={styles.btn}></div>
    </div>
  )
}

Switch.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  control: PropTypes.bool,  // 外部值控制
}

export default Switch
