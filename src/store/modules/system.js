// 系统信息
import { Loading } from 'element-ui'
import { addVal2Arr } from '@/utils/dataFunction'

export default {
  namespaced: true,
  state: {
    // 左侧菜单收起
    isCollapse: false,
    // 窗口
    clientHeightType: 0,
    // 取消请求的cancel列表
    axiosPromiseArr: [],
    // 动态路由
    asyncRouter: [],
    // 全局loading对象
    loadingObj: null,
    // 是否全局loading
    isLoading: false,
    // keep-alive当前路由的全部信息
    cachedArrInfo: [],
    // 保存首页请求的jsonStr
    appGlobalResp: null,
    // 接口loading效果
    portLoading: false,
    // 登录页信息接口loading
    loginLoading: false
  },
  getters: {
    getIsCollapse(state) {
      return state.isCollapse
    },
    getClientHeightType(state) {
      return state.clientHeightType
    },
    getAsyncRouter(state) {
      return state.asyncRouter
    },
    getApiLoading(state) {
      return state.portLoading
    },
    getCachedArrInfo(state) {
      return state.cachedArrInfo
    },
    getAppGlobalResp(state) {
      return state.appGlobalResp
    },
    getLoginLoading(state) {
      return state.loginLoading
    }
  },
  mutations: {
    setIsCollapse(state, val) {
      state.isCollapse = val
    },
    setClientHeightType(state, val) {
      state.clientHeightType = val
    },
    // 添加axios的cancel到请求列表
    pushAxiosPromise(state, cancel) {
      state.axiosPromiseArr.push({ cancel })
    },
    // 遍历所有axios的cancel，取消所有请求
    clearAxiosPromiseArr(state) {
      const axiosPromiseArr = state.axiosPromiseArr
      axiosPromiseArr.forEach((cancel) => {
        cancel.cancel()
      })
      state.axiosPromiseArr = []
    },
    setAsyncRouter(state, val) {
      state.asyncRouter = val
    },
    // 全局loading服务，开启loading
    startLoading(state) {
      state.isLoading = true
      state.loadingObj = Loading.service()
    },
    // 全局loading服务，关闭loading
    endLoading(state) {
      state.isLoading = false
      if (state.loadingObj !== null) {
        state.loadingObj.close()
      }
    },
    startApiLoading(state) {
      state.portLoading = true
    },
    endApiLoading(state) {
      if (state.portLoading) {
        state.portLoading = false
      }
    },
    setLoginLoading(state, val) {
      state.loginLoading = val
    },
    // 对指定组件进行动态更改缓存（缓存）--组件调用该方法时，判断该组件是否存在于该缓存数组，无则添加
    iskeepAlive(state, { to }) {
      const alwaysExistComponent = state.asyncRouter[0]
      state.cachedArrInfo = addVal2Arr(
        state.cachedArrInfo,
        alwaysExistComponent,
        'name'
      )
      state.cachedArrInfo = addVal2Arr(state.cachedArrInfo, to, 'name')
      if (state.cachedArrInfo.length > 7) {
        state.cachedArrInfo.splice(1, 1)
      }
    },
    // 对指定组件进行动态更改缓存（不缓存）--组件调用该方法时，从缓存数组中删除对应的组件元素
    noKeepAlive(state, routeInfo) {
      state.cachedArrInfo = state.cachedArrInfo.filter(
        (item) => item.name !== routeInfo.name
      )
    },
    setAppGlobalResp(state, val) {
      state.appGlobalResp = val
    }
  },
  actions: {
    // 添加缓存路由
    dealKeepAlive({ commit, state }, { from, to }) {
      const ifKeep = to.meta.keepAlive
      if (ifKeep) {
        commit('iskeepAlive', { to })
      }
    },
    // 删除缓存路由
    deleteKeepAlive({ commit, state }, routeInfo) {
      const ifKeep = routeInfo.meta.keepAlive
      if (ifKeep) {
        commit('noKeepAlive', routeInfo)
      }
    }
  }
}
