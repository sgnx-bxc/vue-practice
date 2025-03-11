import Vue from 'vue'
const Bus = new Vue({
  methods: {
    emit(event, ...args) {
      this.$emit(event, ...args)
    },
    on(event, callBack) {
      this.$on(event, callBack)
    },
    off(event, callBack) {
      this.$off(event, callBack)
    }
  }
})
Vue.prototype.$bus = Bus // 方便全局使用
Vue.use(Bus)
export default Bus
