import { convertChildrenToData, getFilterOptions } from './util'
import OptionList from './OptionList'
import DropDown from './DropDown'
import Selector from './Selector'

const Select = (props) => {
  const {
    wrapperClassName,
    options,
    children,

    // Selector
    title,
    disabled,
    placeholder,
    defaultValue,
    value,
    className,
    buttonTextClassName,

    // search
    enableSearch,
    optionFilterProp,
    filterFuncProp,
    onSearch,

    // Dropdown
    defaultOpen,
    open,
    onDropdownVisibleChange,
    dropdownRender,
    dropdownClassName,

    // Events
    onChange: onSelect,

    // others
    notFoundContent,
    isCountryCode,
  } = props
  // ============================= DropDown =============================
  const [innerOpen, setInnerOpen] = React.useState(open || defaultOpen)
  const onToggleOpen = (newOpen) => {
    const nextOpen = newOpen !== undefined ? newOpen : !innerOpen

    if (innerOpen !== nextOpen && !disabled) {
      setInnerOpen(nextOpen)

      if (onDropdownVisibleChange) {
        onDropdownVisibleChange(nextOpen)
      }
    }

    if (!nextOpen) {
      setInnerSearchValue(null)
    }
  }

  // ============================= Selector ===============================
  const [innerSearchValue, setInnerSearchValue] = React.useState('')
  let mergedSearchValue = innerSearchValue
  const triggerSearch = (searchText) => {
    let newSearchText = searchText
    setInnerSearchValue(newSearchText)

    if (onSearch && mergedSearchValue !== newSearchText) {
      onSearch(newSearchText)
    }
  }

  // ============================= OptionList =============================
  const mergedOptions = React.useMemo(() => {
    let newOptions = options
    if (options === undefined) {
      newOptions = convertChildrenToData(children)
    }
    return newOptions
  }, [options, children])

  const displayOptions = React.useMemo(() => {
    if (!mergedSearchValue) {
      return [...mergedOptions]
    }

    const filterOptions = getFilterOptions(mergedSearchValue, mergedOptions, {
      optionFilterProp,
      filterFuncProp,
    })
    return [...filterOptions]
  }, [mergedOptions, mergedSearchValue])

  // ============================= Values =============================
  const rawValue = value !== undefined && value !== null ? value : defaultValue
  // Selector display value
  const displayValues = React.useMemo(() => {
    const displayValues = mergedOptions.filter(
      (item) => item.value === rawValue
    )
    return displayValues
  }, [rawValue, mergedOptions])

  // OptionList display value
  const rawValues = React.useMemo(() => {
    return new Set([rawValue])
  }, [rawValue])

  // ============================= Select =============================
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (innerOpen) {
      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [innerOpen])

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      onToggleOpen(false)
    }
  }

  const OptionListElement = (
    <OptionList
      flattenOptions={displayOptions}
      values={rawValues}
      onSelect={onSelect}
      notFoundContent={notFoundContent}
      onToggleOpen={onToggleOpen}
      setInnerSearchValue={setInnerSearchValue}
    />
  )

  return (
    <div class={`Select ${wrapperClassName}`} ref={containerRef}>
      <Selector
        title={title}
        disabled={disabled}
        placeholder={placeholder}
        open={innerOpen}
        values={displayValues}
        onSearch={triggerSearch}
        onToggleOpen={onToggleOpen}
        enableSearch={enableSearch}
        searchValue={mergedSearchValue}
        className={className}
        buttonTextClassName={buttonTextClassName}
        isCountryCode={isCountryCode}
      />

      <DropDown
        open={innerOpen}
        popupElement={OptionListElement}
        dropdownRender={dropdownRender}
        dropdownClassName={dropdownClassName}
      />
    </div>
  )
}

Select.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  title: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  enableSearch: PropTypes.bool,
  optionFilterProp: PropTypes.string,
  filterFuncProp: PropTypes.func,
  onSearch: PropTypes.func,
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  onDropdownVisibleChange: PropTypes.func,
  dropdownRender: PropTypes.func,
  dropdownClassName: PropTypes.string,
  onSelect: PropTypes.func,
  notFoundContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

Select.defaultProps = {
  className: '',
  wrapperClassName: '',
  dropdownClassName: '',
  buttonTextClassName: '',
  optionFilterProp: 'label',
}

export default Select
