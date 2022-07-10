import React from 'react'

export const ProfileContext = React.createContext({})

export const state = {
  profile: {},
  userInfo: {},
  groupInfo: {},
  isLogin: false,
}

export function reducer(preState, action) {
  const { type } = action
  switch (type) {
    case 'profile':
      return {
        ...preState,
        profile: action.profile,
      }
    case 'userInfo':
      return {
        ...preState,
        userInfo: action.userInfo,
      }
    case 'groupInfo':
      return {
        ...preState,
        groupInfo: action.groupInfo,
      }
    case 'isLogin':
      return {
        ...preState,
        isLogin: action.isLogin,
      }
    default:
      return preState
  }
}
