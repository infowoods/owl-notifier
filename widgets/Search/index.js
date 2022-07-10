import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon'
import { getFilterOptions } from './util'
import './index.module.scss'

// 这个组件是实时展示搜索结果的

const Search = (props) => {
  const {
    options,
    placeholder,
    onChange,
    onSearch,
    optionFilterProp,
    filterFuncProp,
    searchValue,
    type,
    maxLength,
    customSearchLimit,
    class: className,
    onFocus: propsOnFocus,
  } = props

  const [focus, setFocus] = useState(false)
  const onFocus = () => {
    setFocus(true)
  }

  const onBlur = () => {
    setFocus(false)
  }

  const filterCallback = (value, options) => {
    setInputValue(value)
    onSearch(value)

    const filterOptions = getFilterOptions(value, options, {
      optionFilterProp,
      filterFuncProp,
    })
    onChange(filterOptions)
  }

  const [inputValue, setInputValue] = useState(searchValue)
  const onInputChange = ({ target: { value } }) => {
    setInputValue(value)
  }

  const onClear = () => {
    setInputValue('')
  }

  const inputTypeLimit = (value) => {
    const valueStr = value.toString().replace(/[^a-zA-Z0-9]/, '')
    return valueStr
  }

  const inputLengthLimit = (value) => {
    const valueStr = value.toString().slice(0, maxLength)
    return valueStr
  }

  useEffect(() => {
    propsOnFocus && propsOnFocus(focus)
  }, [focus])

  useEffect(() => {
    let formatValue = inputValue
    formatValue =
      type === 'nonSymbols' ? inputTypeLimit(formatValue) : formatValue
    formatValue = maxLength
      ? inputLengthLimit(formatValue, maxLength)
      : formatValue
    formatValue = customSearchLimit
      ? customSearchLimit(formatValue)
      : formatValue
    filterCallback(formatValue, options)
  }, [inputValue])

  useEffect(() => {
    setInputValue(searchValue)
  }, [searchValue])

  return (
    <div className={`Search ${focus && 'Search-focus'} ${className}`}>
      <Icon type="search" className="Search-icon" />
      <input
        className="Search-input"
        size="10"
        onChange={onInputChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        value={inputValue}
        maxLength={maxLength}
      />
      {focus && inputValue !== '' && (
        <Icon
          type="close-fill"
          className="clear-icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
        />
      )}
    </div>
  )
}

Search.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  filterFuncProp: PropTypes.func,
  searchValue: PropTypes.string,
  optionFilterProp: PropTypes.string,
  type: PropTypes.oneOf(['nonSymbols']),
  maxLength: PropTypes.number,
  customSearchLimit: PropTypes.func,
}

Search.defaultProps = {
  placeholder: 'Search…',
  searchValue: '',
  options: [],
  onChange: () => {},
  onSearch: () => {},
}

export default Search
