// sessionStorage和localStorage
// 浏览器或标签页关闭即失效
// 只对当前标签页有效，除非内部页面跳转打开新标签页会把sessionStorage带过去，手动打开新标签页无效
const db = {
  // ---- sessionStorage ----
  save(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  get(key, defaultValue = {}) {
    try {
      const value = JSON.parse(sessionStorage.getItem(key)) || defaultValue
      return value
    } catch {
      return defaultValue
    }
  },
  remove(key) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  },
  // ---- localStorage ----
  localSave(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  localGet(key, defaultValue = {}) {
    try {
      const value = localStorage.getItem(key)
      return value
    } catch {
      return defaultValue
    }
  },
  localRemove(key) {
    localStorage.removeItem(key)
  },
  localClear() {
    localStorage.clear()
  }
}
export default db
