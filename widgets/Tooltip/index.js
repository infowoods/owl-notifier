import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function Tooltip(props) {
  const {
    class: className,
    visible: propsVisible,
    content,
    onChange,
    children,
    theme,
    position,
    tooltipClassName,
    positionPercent
  } = props
  const [ visible, setVisible ] = useState(false)
  const tooltipRef = useRef()

  useEffect(() => {
    setVisible(propsVisible)
  }, [propsVisible])

  useEffect(() => {
    onChange && onChange(visible)
  }, [visible])

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => {
        setVisible(true)
        tooltipRef.current.focus()
      }}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className={`${styles.tooltip} ${styles[theme]} ${styles[position]} ${styles[tooltipClassName]}`}
        style={{ display: visible ? 'block' : 'none', [position]: positionPercent }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {content}
      </div>

      <div
        ref={tooltipRef}
        className={`${styles.children} ${styles[className] || styles[props.className]}`}
        tabIndex="0"
        onBlur={() => setVisible(false)}
        onClick={() => setVisible(true)}
      >
        {children}
      </div>
    </div>
  )
}

Tooltip.defaultProps = {
  theme: 'dark',
  position: 'center'
}

Tooltip.propTypes = {
  visible: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.object
  ]),
  onChange: PropTypes.func,
  class: PropTypes.string,
  theme: PropTypes.oneOf(['white', 'dark']),
  position: PropTypes.oneOf(['left', 'center', 'right', 'top']),
  tooltipClassName: PropTypes.string,
}

export default Tooltip