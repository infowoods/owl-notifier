import { useContext } from 'react'
import AuthMixin from './auth/AuthMixin'
import StorageUtil from './storageUtil'
import { getProfile } from '../services/api/mixin'
import { ProfileContext } from '../stores/useProfile'

const MIXIN_TOKEN = 'mixin_token'
const OWL_USER = 'user_info_'

// const profile = useContext(ProfileContext)
// console.log('ppProfile:', profile)

export function authLogin() {
  AuthMixin.requestCode(true)
}

export function logout (dispatch, conversation_id) {
  const conversationId = StorageUtil.get('current_conversation_id')
  const id = conversationId === null ? '' : conversationId
  dispatch({
    type: 'profile',
    profile: {},
  })
  console.log('logout')
  StorageUtil.del(OWL_USER + id)
  StorageUtil.del('mixin_token')
}

export async function loadAccountInfo(dispatch) {
  const profile = await getProfile()
  dispatch({
    type: 'profile',
    profile,
  })
}

export function saveToken({ token }) {
  StorageUtil.set(MIXIN_TOKEN, token)
}

export function getToken() {
  if (process.env.NODE_ENV === 'development' && process.env.TOKEN) {
    console.log('dev env')
    return process.env.TOKEN
  }
  const conversationId = StorageUtil.get('current_conversation_id')
  // console.log('cc id:', conversationId)
  const id = conversationId === null ? '' : conversationId
  const token = StorageUtil.get(OWL_USER + id)?.access_token
  return token
}
