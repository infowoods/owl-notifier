import http from '../../services/http/mixin'
import { MIXIN_CLIENT_ID, StorageKeys } from '../../constants'
import StorageUtil from '../../utils/storageUtil'

export async function getAccessToken (code) {
  const verifier = localStorage.getItem('code-verifier')
  const data = {
    client_id: MIXIN_CLIENT_ID,
    code,
    code_verifier: verifier
  }
  const res = await http.post('/oauth/token', { data })
  return res.access_token
}

export function getUser (id) {
  return http.get(`/users/${id}`)
}

export function getProfile () {
  return http.get('/me')
}

export function loginFunc (token) {
  StorageUtil.set('mixin_token', token)
}
