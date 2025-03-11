import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import { Notification } from 'element-ui'
const RightsUrl = '/customer-center/team/role/user' // 权限接口

let requestCount = 0
const noLoad = ['/api/csearchTable/blackListAdd']

// 创建axios实例
const sysConfig = window.sysConfig || {}
const timeout = sysConfig.timeout || 60
const axiosService = axios.create({
  timeout: timeout * 1000, // 请求超时时间
  // 默认请求头
  headers: {
    'Content-Type': 'application/json'
  }
})

// **** http请求拦截器 ****
// 请求拦截中，需要根据参数进行特殊处理的mock url
axiosService.interceptors.request.use(
  function (config) {
    requestCount++
    if (noLoad.includes(config.url.split('?')[0])) {
      store.commit('system/endApiLoading')
    } else {
      store.commit('system/startApiLoading')
    }
    // mock的url处理
    const mockInterface = sysConfig.mockInterface || {}
    if (mockInterface.isMock) {
      let reqMethodType = config.method
      if (config.url.indexOf('?') !== -1) {
        const param = config.url.split('?')[1]
        config.url = config.url.split('?')[0]
        config.params = qs.parse(param)
      }
      let urlList = config.url.split('/')
      urlList = urlList.map((urlitem) => {
        return urlitem.replace(/[-_]/g, '')
      })
      let reqUrlKey = ''
      for (let i = 2; i < urlList.length; i++) {
        reqUrlKey = reqUrlKey + urlList[i]
      }
      let uniqueMockKey = reqMethodType + reqUrlKey
      if (uniqueMockKey.indexOf('?') !== -1) {
        uniqueMockKey = uniqueMockKey.split('?')[0]
      }
      if (mockInterface.isAllMock || mockInterface.mockDatas[uniqueMockKey]) {
        if (mockInterface.isJson) {
          config.method = 'get'
          config.url = `/mock/${uniqueMockKey}.json?t=${new Date().getTime()}`
        } else {
          if (mockInterface.mockDatas.hasOwnProperty(uniqueMockKey)) {
            config.url = `/mock/${uniqueMockKey}/data`
          } else {
            config.url = `/mock/getdefaultport/data`
          }
        }
      }
    }
    // 添加token
    const token = store.state.account.token
    if (store.state.account.token && typeof token === 'string') {
      config.headers.common.Authorization = `bearer ${token}`
    }
    // 添加默认的请求头
    if (config.headers['Content-Type'] === undefined) {
      config.headers['Content-Type'] = 'application/json'
    }
    // 用于路由跳转时取消所有请求
    if (sysConfig.requestCancelBeforeRoute) {
      config.cancelToken = new axios.CancelToken(function (cancel) {
        store.commit('system/pushAxiosPromise', cancel)
      })
    }
    return config
  },
  function (error) {
    store.commit('system/startApiLoading')
    // 对请求失败做处理
    console.error(error.message)
    return Promise.reject(error)
  }
)

// **** http响应拦截器 ****
axiosService.interceptors.response.use(
  function (response) {
    requestCount--
    if (requestCount === 0) {
      store.commit('system/endApiLoading')
    }
    return response
  },
  function (error) {
    requestCount--
    if (requestCount === 0) {
      store.commit('system/endApiLoading')
    }
    // token超时标识
    const tokenTimeout = store.state.account.tokenTimeout
    if (tokenTimeout) {
      return
    }
    // 请求已取消
    if (error.__CANCEL__ === true) {
      return
    }
    // 鉴权请求接口不处理错误码
    if (error.config.url.indexOf(RightsUrl) !== -1) {
      return Promise.reject(error)
    }
    // 对错误响应做处理
    if (error.response) {
      const response = error.response
      const status = response.status
      const errMsg = response.statusText || '系统内部异常，请联系网站管理员'
      const responseData = response.data
      const isobj =
        Object.prototype.toString.call(responseData) === '[object Object]'
      let tipstr = `错误码：${status}，${errMsg}`
      switch (status) {
        case 401:
          tipstr = '很抱歉，登录已失效，系统将在5s后自动退出，请重新登录'
          if (isobj) {
            const msg = responseData.msg
            tipstr = `很抱歉，${msg} ，系统将在5s后自动退出，请重新登录`
          }
          notificationTip(tipstr)
          logoutEvent()
          break
        case 403:
          notificationTip(
            '很抱歉，您没有访问权限，系统将在5s后自动退出，请重新登录'
          )
          logoutEvent()
          break
        case 404:
          notificationTip('很抱歉，资源未找到')
          break
        default:
          notificationTip(tipstr)
          break
      }
    } else if (error.code === 'ECONNABORTED') {
      notificationTip('请求超时')
    } else {
      notificationTip('网络异常')
    }
    return Promise.reject(error)
  }
)

// 接口统一处理逻辑入口，headers为自定义请求头
export const getdata = function (
  method,
  url,
  params = {},
  headers = null,
  timeout = null
) {
  let data = null
  let newUrl = url
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    data = params
  } else {
    data = {}
  }
  let serviceParams = {}
  if (method === 'GET') {
    serviceParams = params
    const paramsStr = qs.stringify(serviceParams)
    if (paramsStr !== '') {
      newUrl = `${url}?${paramsStr}`
      serviceParams = {}
    }
  }
  const service = {
    method: method,
    url: newUrl,
    data: data,
    params: serviceParams
  }
  if (headers !== null) {
    service.headers = headers
  }
  if (timeout !== null) {
    service.timeout = timeout
  }
  return axiosService(service)
}

// excel导出方法
export const exportReq = function (
  type,
  url,
  params = {},
  excelName = null,
  config = {}
) {
  if (type.toLowerCase() === 'get') {
    // get
    config.responseType = 'blob'
    return new Promise((resolve, reject) => {
      axiosService
        .get(convertGetParams(url, params), config)
        .then((r) => {
          exportReqRet(r, excelName, resolve, reject)
        })
        .catch((e) => {
          console.error(e)
          reject(e)
        })
    })
  } else {
    // post
    config.responseType = 'blob'
    return new Promise((resolve, reject) => {
      axiosService
        .post(url, params, config)
        .then((r) => {
          exportReqRet(r, excelName, resolve, reject)
        })
        .catch((e) => {
          console.error(e)
          reject(e)
        })
    })
  }
}

// 导出返回处理
function exportReqRet(r, excelName, resolve, reject) {
  if (Object.prototype.toString.call(r.data) === '[object Blob]') {
    const ret = exportResponseFun(r, excelName)
    if (ret) {
      resolve(true)
    } else {
      reject(r)
    }
  } else {
    reject(r)
  }
}

// 系统提示
function notificationTip(message) {
  Notification.error({
    title: '系统提示',
    message: message,
    offset: 50 // Notification为了不挡住右上角用户下拉，需要设置偏移高度
  })
}

// 退出登录
function logoutEvent() {
  setTimeout(() => {
    window.location.href = '/'
    store.dispatch('account/clearStorage')
  }, 5000)
}

function convertGetParams(url, params) {
  let _params
  if (Object.is(params, undefined)) {
    _params = ''
  } else {
    let paramsArr = []
    for (let key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        paramsArr.push(`${key}=${params[key]}`)
      }
    }
    _params = '?' + paramsArr.join('&')
  }
  return `${url}${_params}`
}

function exportResponseFun(r, excelName) {
  // 处理文件名
  let fileName = excelName
  if (fileName === null) {
    try {
      const disposition = r.headers['content-disposition'] || ''
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(disposition)
      if (matches != null && matches[1]) {
        fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''))
      }
    } catch (e) {
      fileName = `${new Date().getTime()}.xlsx`
    }
  } else {
    fileName = excelName
  }
  if (fileName === null) {
    return false
  } else {
    const content = r.data
    const contentType = r.headers['content-type']
    const blob = new Blob([content], { type: contentType })
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, fileName)
    }
    return true
  }
}
