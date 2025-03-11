import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 动态加载modules目录下所有vuex模块
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modulesMap, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modulesMap[moduleName] = value.default
  return modulesMap
}, {})

const store = new Vuex.Store({
  modules
})

export default store
