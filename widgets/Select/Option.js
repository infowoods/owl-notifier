import React from 'react'

const Option = (props) => {
  const { key, value, children, onClick } = props
  return (
    <div key={key} value={value} onClick={() => onClick(value)}>
      {children}
    </div>
  )
}

export default Option
