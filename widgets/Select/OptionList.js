import React from 'react'
import classNames from 'classnames'
const OptionList = (props) => {
  const { flattenOptions, values, onSelect, notFoundContent, onToggleOpen } =
    props

  const onSelectValue = (value, index) => {
    if (value !== null) {
      onSelect(value, index)
    }

    onToggleOpen(false)
  }

  const [activeIndex, setActiveIndex] = React.useState(null)
  const setActive = (index) => {
    setActiveIndex(index)
  }

  const renderNoData = () => <div class="content-empty">{notFoundContent}</div>

  const renderOptions = () =>
    flattenOptions.map((option, itemIndex) => {
      const { key, value, label, children, disabled } = option

      const selected = values.has(value)
      const optionClassName = classNames('option', {
        'option-active': activeIndex === itemIndex && !disabled,
        'option-disabled': disabled,
        'option-selected': selected,
      })
      return (
        <div
          key={key}
          value={value}
          class={optionClassName}
          onMouseMove={() => {
            if (activeIndex === itemIndex || disabled) {
              return
            }
            setActive(itemIndex)
          }}
          onClick={() => {
            if (!disabled) {
              onSelectValue(value, itemIndex)
            }
          }}
        >
          {children || label}
        </div>
      )
    })

  return flattenOptions.length === 0 ? renderNoData() : renderOptions()
}

export default OptionList
