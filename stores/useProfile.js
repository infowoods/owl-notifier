import React from 'react'

export const ProfileContext = React.createContext({})

export const state = {
  profile: {}
}

export function reducer(preState, action) {
  const { type } = action
  switch (type) {
    case 'profile':
      console.log('preState:', preState)
      console.log('action:', action)
      return {
        ...preState,
        profile: action.profile
      }
    default:
      return preState
  }
}
