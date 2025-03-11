import Vue from 'vue'
import 'core-js'
import 'element-ui/lib/theme-chalk/index.css' // elementUI样式先加载
import App from '@/App.vue'
import router from '@/router/router'
import store from '@/store/index'
// 插件
import ElementUI from 'element-ui'
import moment from 'moment'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import 'echarts-liquidfill'
import 'zrender/lib/svg/svg'
import G6 from '@antv/g6'
// 样式
import 'normalize.css'
import '@/style/common.less'
import '@/style/fonts.less'
import '@/style/skin/default.less'
// 自定义项的全局引入
import db from '@/utils/webStorage'
import '@/utils/vueBus'
import '@/utils/directive/install'
// import '@/utils/vuexss'
import { getIsMock } from '@/mock/index.js'
import chartTool from '@/components/chart/chartTool'
import g6ChartTool from '@/components/chart/g6ChartTool.vue'
import fecursiveFlex from '@/components/flexboard/FecursiveFlex'

const init = () => {
  // 注册全局组件
  Vue.component('ChartTool', chartTool)
  Vue.component('G6ChartTool', g6ChartTool)
  Vue.component('FecursiveFlex', fecursiveFlex)
  // 为false阻止vue在启动时生成生产提示
  Vue.config.productionTip = false
  // 挂载
  Vue.use(ElementUI)
  // 挂载echarts
  Vue.prototype.$echarts = echarts
  // 挂载G6
  Vue.prototype.$g6 = G6
  // 挂载webStorage
  Vue.prototype.$db = db
  // 挂载moment
  moment.locale('zh-cn')
  Vue.prototype.$moment = moment
  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#edr')
}

// 按需加载mock资源
if (getIsMock()) {
  import('@/mock/index.js')
    .then((mockindex) => {
      mockindex.openMock()
      init()
    })
    .catch((err) => {
      console.error('get mock err.', err)
    })
} else {
  init()
}
