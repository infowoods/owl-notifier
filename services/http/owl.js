import axios from 'axios'
import { getToken } from '../../utils/loginUtil'

const OWL_API_HOST = 'https://owl-api.owldeliver.one/v1dev'

const owlrss = axios.create({
  baseURL: OWL_API_HOST,
  timeout: 15000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

owlrss.interceptors.request.use(
  async (configs) => {
    console.log('configs:', configs)
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
    console.log('interceptors res:', res)
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
    console.log('interceptors err:', err)
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data)
    } else {
      return Promise.reject({ code: -1 })
    }
  }
)

async function request (options) {
  const res = await owlrss.request(options)
  console.log('post res:', res)
  return Promise.resolve(res.data)
}

export default {
  post (url, options = {}) {
    console.log('post url:', url)
    const config = {
      url,
      method: 'post',
      ...options
    }
    return request(config)
  },

  get (url, options = {}) {
    const config = {
      url,
      method: 'get',
      ...options
    }
    return request(config)
  },

  delete (url, options = {}) {
    const config = {
      url,
      method: 'delete',
      ...options
    }
    return request(config)
  }
}
