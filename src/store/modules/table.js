export default {
  namespaced: true,
  state: {
    isLoading: false,
    reqParam: {}, // 查询条件
    timeParam: {} // timeRangeRadio组件查询时间参数
  },
  getters: {
    // 在layout的菜单路由区域获取加载loading遮罩，避免触发多次异步查询导致数据显示错误
    getIsLoading(state) {
      return state.isLoading
    },
    getReqParam(state) {
      return state.reqParam
    },
    getTimeParam(state) {
      return state.timeParam
    }
  },
  mutations: {
    // tableMain组件中查询数据时为ture，数据加载完成为false；在路由跳转时置为false，避免跳转时查询未返回页面仍在loading
    setIsLoading(state, val) {
      state.isLoading = val
    },
    setReqParam(state, val) {
      state.reqParam = val
    },
    setTimeParam(state, val) {
      state.timeParam = val
    }
  }
}
