// 用户登录信息
import db from '@/utils/webStorage'
import { welcome, getUrlInfoPort } from '@/api/request/common'
export default {
  namespaced: true,
  state: {
    // 默认密码
    defaultPwd: '1234qwer',
    // 密码RSA加密公钥
    publicKey:
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5pj5Tndt7s5PDpvcBNQHbk2mSXKKnaHrsXpTgul22fbhoYVwRKdkjRVMhxbh7Gu7/9LH2Q1antWmG9Xi86e3dX4XAf0NkoJS+0q0kOC5My7knKVVl3EaIPLSTTz/XVzjg4Yld8a/5FJRvMqwI4uMP3YqAXGt+0RFbkPBOQa7chQIDAQAB',
    // token
    token: db.get('USER_TOKEN'),
    // 过期时间
    expireTime: db.get('EXPIRE_TIME'),
    // 用户信息
    user: db.get('USER'),
    // 角色信息
    role: db.get('ROLE'),
    // 按钮操作权限
    permissions: db.get('PERMISSIONS'),
    // 菜单权限
    menusBack: db.get('MENU_IDS'),
    // 用于请求token失效后拦截所有请求
    tokenTimeout: false
  },
  mutations: {
    setToken(state, val) {
      db.save('USER_TOKEN', val)
      state.token = val
    },
    setExpireTime(state, val) {
      db.save('EXPIRE_TIME', val)
      state.expireTime = val
    },
    setUser(state, val) {
      db.save('USER', val)
      state.user = val
    },
    setPermissions(state, val) {
      db.save('PERMISSIONS', val)
      state.permissions = val
    },
    setRole(state, val) {
      db.save('ROLE', val)
      state.role = val
    },
    setMenuBack(state, val) {
      db.save('MENU_IDS', val)
      state.menusBack = val
    },
    setTokenTimeout(state, val) {
      state.tokenTimeout = val
    }
  },
  getters: {
    getPublicKey(state) {
      return state.publicKey
    },
    getTabName(state) {
      return state.knowledegeName
    },
    getMenusBack(state) {
      return state.menusBack
    }
  },
  actions: {
    getUrlInfo({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        getUrlInfoPort()
          .then((res) => {
            if (res.data.errorCode === 110000) {
              try {
                const info = res.data.list[0]
                commit('setUser', info)
                commit('setExpireTime', info.expireTime)
                resolve(true)
              } catch (e) {
                reject(new Error('Verification failed, please Login again.', e))
              }
            } else {
              resolve(false)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户权限信息
    getUserInfo({ commit, state }) {
      const params = {
        userId: state.user.userId
      }
      return new Promise((resolve, reject) => {
        welcome(params)
          .then((res) => {
            if (res.data.errorCode === 110000) {
              try {
                // --- 1.处理用户权限信息
                const info = res.data.list[0]
                // 角色信息
                const role = {
                  rolename: info.roleName,
                  roleId: info.roleId
                }
                // 按钮权限
                let permissions = []
                // 菜单权限
                let menusBack = []
                menusBack = info.menus
                permissions = info.permissions
                // 提交store
                commit('setTokenTimeout', false)
                commit('setRole', role)
                commit('setPermissions', permissions)
                commit('setMenuBack', menusBack)
                resolve(true)
              } catch (e) {
                reject(new Error('Verification failed, please Login again.', e))
              }
            } else {
              resolve(false)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 清空登录信息
    clearStorage({ commit, dispatch }, timeout = 0) {
      db.clear() // 清除sessionStorage
      commit('setTokenTimeout', true)
      commit('setExpireTime', null)
    }
  }
}
