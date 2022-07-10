export const convertChildrenToData = (nodes) => {
  if (!nodes) return []

  let newOptions = Array.isArray(nodes) ? nodes : [nodes]
  newOptions = newOptions.map((node, itemIndex) => {
    const {
      key,
      props: { ...restProps },
    } = node
    return { key, ...restProps }
  })

  return newOptions
}

function getFilterFunction(optionFilterProp) {
  return (searchValue, option) => {
    const lowerSearchText = searchValue.toLowerCase()

    // Option label search
    const rawLabel = option[optionFilterProp]
    const value = rawLabel && rawLabel.toLowerCase()
    return value.indexOf(lowerSearchText) > -1 && !option.disabled
  }
}

export const getFilterOptions = (
  searchValue,
  options,
  { optionFilterProp, filterFuncProp }
) => {
  const filteredOptions = []
  let filterFunc
  if (typeof filterFuncProp === 'function') {
    filterFunc = filterFuncProp
  } else {
    filterFunc = getFilterFunction(optionFilterProp)
  }

  options.forEach((item) => {
    if (filterFunc(searchValue, item)) {
      filteredOptions.push(item)
    }
  })

  return filteredOptions
}
