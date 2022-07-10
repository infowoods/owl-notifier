import axios from 'axios'
import { getToken } from '../../utils/loginUtil'

const MIXIN_API_HOST = 'https://mixin-api.zeromesh.net'

const owlrss = axios.create({
  baseURL: MIXIN_API_HOST,
  timeout: 15000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

owlrss.interceptors.request.use(
  async (configs) => {
    if (configs.url === '/oauth/token') {
      return configs
    }
    const token = await getToken()
    if (token) {
      configs.headers.Authorization = `Bearer ${token}`
    }
    return configs
  },
  (_) => {}
)

owlrss.interceptors.response.use(
  (res) => {
    if (!res.data) {
      return Promise.reject({ code: -1 })
    }
    if (res.data.error) {
      const error = res.data.error
      if (error.code === (401 || 403)) {
        return Promise.reject({ code: error.code })
      }
      return Promise.reject({ code: error.code, message: error.description })
    } else {
      return Promise.resolve(res.data)
    }
  },
  (err) => {
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data)
    } else {
      return Promise.reject({ code: -1 })
    }
  }
)

async function request (options) {
  const res = await owlrss.request(options)
  return Promise.resolve(res.data)
}

const http = {
  post: (url, options = {}) => {
    const config = {
      url,
      method: 'post',
      ...options
    }
    return request(config)
  },

  get: (url, options = {}) => {
    const config = {
      url,
      method: 'get',
      ...options
    }
    return request(config)
  },

  delete: (url, options = {}) => {
    const config = {
      url,
      method: 'delete',
      ...options
    }
    return request(config)
  }
}

export default http
