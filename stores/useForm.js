import { useEffect, useRef, useState } from 'react'
import ErrorMessage from '../widgets/ErrorMessage'

export default function useForm() {
  const [ state, setState ] = useState({})
  const ref = useRef({})

  useEffect(() => {
    const refKeys = Object.keys(ref.current)
    const stateKeys = Object.keys(state)
    if (refKeys.length !== stateKeys.length) {
      initForm()
    }
  }, [state])

  useEffect(() => {
    const refKeys = Object.keys(ref.current)
    const stateKeys = Object.keys(state)
    if (refKeys.length !== stateKeys.length) {
      initForm()
    }
  }, [Object.keys(ref.current)])

  const initForm = () => {
    const initState = {}
    for (let key in ref.current) {
      const field = ref.current[key] || {}
      const { name, initialValue, validator = () => '' } = field
      if (name) {
        const preValue = state[name] || {}
        initState[name] = {
          value: initialValue || "",
          initialValue,
          error: undefined,
          validator,
          ...preValue
        }
      }
    }
    setState(initState)
  }

  const register = (options) => Element => {
    const { errors = {}, values = {} } = formatState()
    const {
      name, onChange, normalize, trigger = 'onChange', onBlur = () => '',
      validator = () => ''
    } = options
    if (!ref.current[options.name]) {
      ref.current[options.name] = options
    }
    const error = errors[name]
    const props = {
      value: values[name],
      error: !!error,
      normalize,
      onBlur: trigger === 'onBlur' ? () => elementOnBlur(name, { onBlur }) : () => onBlur(values[name]),
      onChange: value => {
        elementOnchange(value, name, {
          onChange,
          normalize,
          trigger,
          validator,
        })
      },
      name,
      setErrors,
      validator,
    }
    Element.props = {
      ...Element.props,
      ...options,
      ...props,
    }
    return (
      <ErrorMessage error={error}>
        {Element}
      </ErrorMessage>
    )
  }

  const elementOnBlur = async (name, { onBlur }) => {
    await validator([name])
    onBlur && onBlur(state[name]?.value)
  }

  const changeState = (name, newState) => {
    if (!name || !newState) {
      return
    }
    setState(state => ({
      ...state,
      [name]: {
        ...state[name],
        ...newState
      }
    }))
  }


  const elementOnchange = (value, name, {
    onChange,
    normalize,
    trigger,
    validator,
  }) => {
    if (normalize) {
      value = normalize(value)
    }
    if (trigger !== 'onBlur') {
      const error = validator(value)
      setErrors({ [name]: error })
    }
    changeState(name, { value })
    onChange && onChange(value)
  }

  const formatState = () => {
    const values = {}
    const errors = {}
    for (let key in state) {
      values[key] = state[key].value
      errors[key] = state[key].error
    }
    return { errors, values }
  }

  const getValues = (names) => {
    const { values } = formatState()
    if (Array.isArray(names)) {
      const result = {}
      names.forEach(item => {
        result[item] = values[item]
      })
      return result
    }
    return values
  }

  const setValues = (values) => {
    if (values && values.__proto__ !== Object.prototype) {
      console.warn('values must be objcct')
      return
    }
    if (values.__proto__ === Object.prototype) {
      const keys = Object.keys(values)
      keys.forEach(name => {
        const normalize = state[name] && state[name].normalize ? state[name].normalize : null
        let value = values[name]
        if (normalize) {
          value = normalize(value)
        }
        changeState(name, { value })
      })
    }
  }

  const getErrors = (names) => {
    const { errors } = formatState()
    if (Array.isArray(names)) {
      const result = {}
      names.forEach(item => {
        result[item] = errors[item]
      })
      return result
    }
    return errors
  }

  const setErrors = (errors) => {
    if (errors && errors.__proto__ !== Object.prototype) {
      console.warn('errors must be objcct')
      return
    }
    if (errors.__proto__ === Object.prototype) {
      const keys = Object.keys(errors)
      keys.forEach(name => {
        changeState(name, { error: errors[name] })
      })
    }
  }

  const resetValues = (names) => {
    if (Array.isArray(names)) {
      names.forEach(name => {
        const value = state[name].initialValue || ''
        changeState(name, { value })
      })
      return
    }
    const newState = { ...state }
    for (let key in newState) {
      newState[key].value = state[key].initialValue || ''
    }
    setState(newState)
  }

  const resetErrors = (names) => {
    if (Array.isArray(names)) {
      names.forEach(name => {
        changeState(name, { error: undefined })
      })
      return
    }
    const newState = state
    for (let key in newState) {
      newState[key].error = undefined
    }
    setState(newState)
  }

  const validator = (names) => {
    let keys = Object.keys(state)
    if (Array.isArray(names)) {
      keys = names
    }
    const errors = {}
    keys.forEach(key => {
      const { validator, value } = state[key] || {}
      if (validator) {
        errors[key] = validator(value)
        changeState(key, { error: validator(value) })
      }
    })
    return errors
  }

  const validatorValues = async (names) => {
    const errors = validator(names)
    const { values } = formatState()
    let isErrors = false
    for (let key in errors) {
      if (errors[key]) {
        isErrors = true
        break
      }
    }
    return { errors, values, isErrors }
  }

  return {
    register,
    getValues,
    setValues,
    resetValues,
    getErrors,
    setErrors,
    resetErrors,
    validatorValues,
  }
}
