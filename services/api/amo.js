import http from '../../services/http/amo'

// 授权
export function amoAuth(data) {
  return http.post('/oauth/mixin', { data })
}


// 获取用户Amo列表
export function getAmoList(data) {
  return http.get('/amos', { data })
}


// 获取用户信息
export function getMe() {
  return http.get('/users/me')
}


// 获取示例脚本
export function getSamples() {
  return http.get('/scripts/samples')
}


// 获取Amo脚本细节
export function getDetails(amo_id) {
  return http.get(`/amos/${amo_id}`)
}


// 运行脚本
export function runAmo(amo_id) {
  return http.post(`/amos/${amo_id}/run`)
}


// 获取脚本日志
export function amoLogs(amo_id) {
  return http.get(`/amos/${amo_id}/logs`)
}


// 创建Amo
export function creatAmo(data) {
  return http.post('/amos', { data })
}


// 更新Amo
export function updateAmo(amo_id, data) {
  return http.put(`/amos/${amo_id}`, { data })
}


// 删除Amo
export function deleteAmo(amo_id) {
  return http.delete(`/amos/${amo_id}`)
}


/**
 *
 * @param {url} String optional
 * @param {code} String optional
 * @returns
 * 解析脚本
 */
export function parseScript (data) {
  return http.post('/scripts/parse', { data })
}
