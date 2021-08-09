import http from '../../services/http/owl'
import { MIXIN_CLIENT_ID, StorageKeys } from '../../constants'
import StorageUtil from '../../utils/storageUtil'

/**
 *
 * @param {code} code 授权机器人后mixin返回的code
 * @param {conversation_id} 标识群组
 * @returns
 * 登录获取owl令牌和用户信息
 */
export function owlSignIn (data) {
  console.log('invoke signin')
  console.log('signin params:', data)
  return http.post('/mixin/signin', { data })
}

// 获取用户订阅列表
export function getFollows (data) {
  return http.get('/user/follows', { data })
}

/**
 *
 * @param {action} 'unfollows'
 * @param {tids} List
 * @returns
 * 取消关注Feeds
 */
export function unfollowFeeds (data) {
  return http.post('/user/follows', { data })
}

/**
 *
 * @param {action} 'parse_uri'
 * @param {uri} String
 * @returns
 * 解析RSS地址
 */
export function parseFeed (data) {
  return http.post('/topic', { data })
}

/**
 *
 * @param {action} 'query'
 * @param {uri} String optional
 * @param {tid} String optional
 * @returns
 * 解析Topic地址
 */
export function parseTopic (data) {
  return http.post('/topic', { data })
}

/**
 *
 * @param {action} 'follow'
 * @param {period} String
 * @param {tid} String
 * @returns
 * 申请关注
 */
export function subscribeTopic (data) {
  return http.post('/topic', { data })
}