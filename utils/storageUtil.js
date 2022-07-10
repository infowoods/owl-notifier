const storageUtil = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    const value = localStorage.getItem(key)
    if (value !== 'undefined') {
      return JSON.parse(value)
    }
    return
  },
  del(key) {
    localStorage.removeItem(key)
  },
}

export default storageUtil
