import { useState, useRef } from 'react'
import Icon from '../Icon'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function TextArea(props) {
  const {
    className: className,
    title,
    disabled,
    prefix,
    suffix,
    ...inputProps
  } = props

  const textAreaRef = useRef()
  const [ focus, setFocus ] = useState(false)

  const { value } = inputProps
  const inputValue = value

  const onFocus = evt => {
    setFocus(true)
    inputProps.onFocus && inputProps.onFocus(evt)
  }

  const onChange = evt => {
    const value = evt.target.value
    inputProps.onChange(value)
    resize()
  }

  const resize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  const onBlur = evt => {
    setFocus(false)
    inputProps.onBlur && inputProps.onBlur(evt)
  }

  const onClear = () => {
    inputProps.onChange('')
  }

  return (
    <div className={`${styles.textArea} ${className} ${focus && styles.focus} ${disabled && styles.disabled}`}>
      {title && (
        <p className={styles.label}>{title}</p>
      )}

      <div className={styles.row}>
        {prefix && prefix}
        <textarea
          ref={textAreaRef}
          className={styles.inputArea}
          value={inputValue}
          onFocus={onFocus}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          maxLength={inputProps.maxLength}
        />
          <Icon
            type="clear-fill"
            className={`${styles.clear} ${focus && inputProps.value !== '' && styles.show}`}
            onMouseDown={e => e.preventDefault()}
            onClick={onClear}
          />
        {suffix && suffix}
      </div>
    </div>
  )
}

TextArea.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  suffix: PropTypes.element, // 输入框右侧，清除按钮后的额外元素
  prefix: PropTypes.element, // 输入框左侧额外元素，如R$
}

TextArea.defaultProps = {
  className: '',
  type: 'text',
  value: '',
  disabled: false,
  onChange: () => {},
}

export default TextArea
