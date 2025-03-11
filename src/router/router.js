import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import Layout from '@/components/layout/index'
import localRoutes from './local'
import { MessageBox } from 'element-ui'
const PAGE403 = '/403'
const PAGE404 = '/404'
const PAGELOGIN = '/login'
const { constantRoutes, asyncRoutes, pageRoutes } = localRoutes

const ConstantPath = constantRoutes.map((item) => {
  return item.path
})

Vue.use(Router)

NProgress.configure({ showSpinner: false })

// 解决elementUI导航栏中的vue-router在3.0版本以上，push方法，重复点击菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function (location) {
  return originalPush.call(this, location).catch((err) => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function (location) {
  return originalReplace.call(this, location).catch((err) => err)
}

// 路由实例
const router = new Router({
  mode: 'hash',
  routes: constantRoutes
})

let homeRouter = [] // 有权限的路由对象

// **** 路由前置守卫 ****
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开始路由加载进度
  store.commit('system/clearAxiosPromiseArr') // 取消所有pending中的请求
  store.dispatch('system/dealKeepAlive', { to, from }) // 进行面包屑和缓存组件的处理
  await localBeforeEach(to, from, next)
})

// LOCAL本地部署路由前置守卫
async function localBeforeEach(to, from, next) {
  document.title = getPageTitle(to.meta.name)
  const token = store.state.account.token
  const accessToken = to.query.accessToken
  if (!accessToken && !token.length && to.path !== PAGELOGIN) {
    // 未登录，跳转登录页面
    const toFullPath = to.fullPath || ''
    if (toFullPath !== '/') {
      // 携带service参数，用于登录成功后进入系统指定页面
      next({ path: PAGELOGIN, query: { service: to.fullPath } })
    } else {
      next({ path: PAGELOGIN })
    }
  } else if (homeRouter.length === 0 && !ConstantPath.includes(to.path)) {
    if (accessToken) {
      store.commit('account/setToken', accessToken)
      await store.dispatch('account/getUrlInfo')
    }
    // 获取用户权限信息
    try {
      store.commit('system/setLoginLoading', true)
      const ret = await store.dispatch('account/getUserInfo')
      store.commit('system/setLoginLoading', false)
      if (!ret) {
        logoutEvent(next, PAGELOGIN)
        return
      }
    } catch (e) {
      logoutEvent(next, PAGELOGIN)
      return
    }
    // 获取并设置动态路由，判断下一跳
    getHomeRouter(to, from, next)
  } else if (to.path === '/') {
    next(from)
    NProgress.done() // 停止路由加载进度
  } else if (!checkHasRoute(to.path)) {
    // 访问的页面不存在
    next({ path: PAGE404, query: { from: from.path } })
  } else {
    // 正常页面跳转
    next()
  }
}
// 跳转登录
function logoutEvent(next = null, page = PAGE403) {
  let countdown = 5 // 设定倒计时的总时间
  const message = `很抱歉，无访问权限，系统将在<span id="countdown">${countdown}</span>s后自动退出，若没有退出，请点击确定按钮立即退出。退出后请重新登录`
  const modalInstance = MessageBox.confirm(message, '提示', {
    customClass: 'default-message-style',
    showClose: false,
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    closeOnHashChange: false,
    dangerouslyUseHTMLString: true
  })
  setTimeout(() => {
    const countdownEl = document.querySelector('#countdown')
    const intervalId = setInterval(() => {
      countdown--
      if (countdown === 0) {
        clearInterval(intervalId)
        window.location.href = '/'
        store.dispatch('account/clearStorage')
      } else {
        countdownEl.innerText = countdown
      }
    }, 1000)
    modalInstance.then(() => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
      window.location.href = '/'
      store.dispatch('account/clearStorage')
    })
    const timeoutId = setTimeout(() => {
      window.location.href = '/'
      store.dispatch('account/clearStorage')
    }, countdown * 1000)
  }, 0)
}

// 获取并设置动态路由，判断下一跳
function getHomeRouter(to, from, next) {
  // 根据权限渲染动态路由
  let menusBack = store.getters['account/getMenusBack']
  if (typeof menusBack === 'object' && menusBack.length === undefined) {
    menusBack = []
  }
  const asyncRouter = getAsyncRouterRights(menusBack)
  const noneLayoutPageRoutes = getAsyncPageRouterRights(menusBack)
  store.commit('system/setAsyncRouter', asyncRouter)
  // 获取指定路径并解析出路径及参数
  const service = from.query.service || to.query.service || ''
  const serviceObj = urlToPathAndParams(service)
  const homeChildren = asyncRouter.concat([
    {
      path: '/403',
      component: () => import('@/views/errorPage/403.vue'),
      meta: {
        name: '403'
      }
    }
  ])
  homeRouter = [
    {
      path: '/index',
      component: Layout,
      children: homeChildren
    },
    ...noneLayoutPageRoutes
  ]
  router.addRoutes(homeRouter)
  // 判断下一跳
  if (checkHasRoute(to.path) && to.path !== '/') {
    // 刷新时进入刷新前的页面
    next({
      ...to,
      replace: true
    })
  } else if (checkHasRoute(serviceObj.path)) {
    next({ path: serviceObj.path, query: serviceObj.params, replace: true })
  } else if (asyncRouter.length > 0) {
    const pRoute = asyncRouter[0]
    next({
      path: pRoute.path,
      replace: true
    })
  } else {
    // 无权限访问
    next({ path: PAGE403, query: { from: from.path } })
  }
}

// 获取菜单权限路由
function getAsyncRouterRights(menusBack) {
  const list = asyncRoutes
  let newlist = []
  newlist = getAsyncRouterRightsLoop(list, menusBack)
  return newlist
}

// 获取菜单权限路由-递归
function getAsyncRouterRightsLoop(menuList, menusBack, newMenuList = []) {
  menusBack.forEach((menu) => {
    if (!menu.children) {
      const needObj = menuList.find((list) => list.path === menu.menuPath)
      const obj = {
        path: menu.menuPath,
        component: needObj.component,
        name: needObj.name,
        meta: {
          name: menu.menuName,
          iconClass: menu.menuIcon,
          keepAlive: needObj.meta.keepAlive
        }
      }
      newMenuList.push(obj)
    } else {
      getAsyncRouterRightsLoop(menuList, menu.children, newMenuList)
    }
  })
  return newMenuList
}

// 获取独立页面权限路由 NNNN 需要修改
function getAsyncPageRouterRights(menusBack) {
  let newMenuList = pageRoutes.filter((menu) => {
    const flag = menusBack.indexOf(parseInt(menu.meta.activeId)) !== -1
    return flag
  })
  return newMenuList
}

// 判断是否存在指定路径的路由
function checkHasRoute(path) {
  const routers = router.getRoutes()
  const allpath = getAllRoutePath(routers)
  const allpathSet = new Set(allpath)
  allpathSet.delete('/index')
  return allpathSet.has(path)
}

// 获取所有路由的path路径
function getAllRoutePath(routers) {
  let pathList = []
  routers.forEach((router) => {
    pathList.push(router.path)
    const children = router.children || []
    if (children.length > 0) {
      const list = getAllRoutePath(children)
      pathList = pathList.concat(list)
    }
  })
  return pathList
}

// **** 路由后置守卫 ****
router.afterEach((to, from, next) => {
  NProgress.done() // 停止路由加载进度
})

// **** 路由导航错误异常回调 ****
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    // 渲染一个路由的过程中，需要尝试解析一个异步组件时发生错误，刷新当前页面
    location.reload()
  }
})

export default router

function urlToPathAndParams(url) {
  let path = url
  let params = {}
  if (url.indexOf('?') !== -1) {
    const urlArr = url.split('?')
    path = urlArr[0]
    params = qs.parse(urlArr[1])
  }
  return { path, params }
}
