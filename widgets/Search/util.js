function getFilterFunction(optionFilterProp) {
  return (searchValue, option) => {
    const lowerSearchText = searchValue.toString().toLowerCase()

    const rawLabel = option[optionFilterProp] || option
    const value = rawLabel && rawLabel.toString().toLowerCase()
    return value.indexOf(lowerSearchText) > -1
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
