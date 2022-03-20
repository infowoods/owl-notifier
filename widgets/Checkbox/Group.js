import { useState, useEffect } from 'react'
import Checkbox from './Checkbox'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function toArray(value) {
  let result = value
  result = !Array.isArray(result) ? [result] : result
  return result
}

function Group(props) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    className,
    flexDirection
  } = props

  const mergedValues = value || defaultValue
  const [checkedValues, setCheckedValues] = useState(toArray(mergedValues))

  useEffect(() => {
    value && setCheckedValues(value)
  }, [value])

  const onCheckboxChange = key => {
    const newCheckedValues = getCheckedValues(key)
    setCheckedValues(newCheckedValues)
    onChange(newCheckedValues)
  }

  const getCheckedValues = key => {
    let result = [...checkedValues]
    const index = checkedValues.indexOf(key)
    const isChecked = index > -1
    isChecked ? result.splice(index, 1) : result.push(key)
    return result
  }

  return (
    <div className={`${styles.group} ${className} ${flexDirection ==='column' && styles.column}`}>
      {options &&
        options.map((item, idx) => (
          <Checkbox
            key={idx}
            value={checkedValues.indexOf(item.value) > -1}
            onChange={() => onCheckboxChange(item.value)}
            disabled={item.disabled}>
            {item.label}
          </Checkbox>
        ))}
    </div>
  )
}

Group.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
}

Group.defaultProps = {
  onChange: () => {},
  className: '',
  flexDirection: 'row'
}

export default Group
