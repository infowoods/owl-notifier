import React from 'react'

const DropDownModal = props => {
  const { open, dropdownRender, popupElement, dropdownClassName } = props

  return (
    open && (
      <div class={`drop-down ${dropdownClassName}`}>
        {dropdownRender ? dropdownRender() : popupElement}
      </div>
    )
  )
}

export default DropDownModal
