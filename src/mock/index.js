// 引入Mock
import Mock from 'mockjs'
import { param2Obj } from '@/utils/urlUtils.js'

// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '500'
})

// 引入全局控制变量
const sysConfig = window.sysConfig || {}
const mockInterface = sysConfig.mockInterface || {}
// 获取当前mock开关状态
export function getIsMock() {
  return mockInterface.isMock && !mockInterface.isJson
}

const checkIsMockFlag = (key) => {
  let isMock = false
  Object.keys(mockInterface.mockDatas).forEach((i) => {
    if (i === key) {
      isMock = mockInterface.mockDatas[i]
    }
  })
  if (mockInterface.isAllMock) {
    return true
  } else {
    return isMock
  }
}

// 获取请求url中的参数对象
function XHR2ExpressReqWrap(respond) {
  return function (options) {
    let result = null
    let { body, type, url } = options
    if (respond instanceof Function) {
      if (typeof body !== 'object') {
        body = JSON.parse(body)
      }
      const params = {
        method: type,
        body: body,
        url: url.split('?')[0],
        query: param2Obj(url)
      }
      result = respond(params)
    } else {
      result = respond
    }
    result.type = 'mock'
    // console.log('mock', url, result, body, param2Obj(url))
    return Mock.mock(result)
  }
}

let configArray = []
export function openMock() {
  if (mockInterface.isMock && !mockInterface.isJson) {
    const modulesFiles = require.context('./modules', true, /\.js$/)
    modulesFiles.keys().forEach((key) => {
      const mocks = modulesFiles(key).default
      mocks.forEach((mock) => {
        if (checkIsMockFlag(mock.name)) {
          const mockObj = {}
          mockObj[`${mock.type}|${mock.url}`] = mock.response
          configArray.push(mockObj)
        }
      })
    })
    configArray.forEach((item) => {
      for (const [path, target] of Object.entries(item)) {
        const protocol = path.split('|')
        Mock.mock(
          new RegExp(`/${protocol[1]}/`),
          protocol[0],
          XHR2ExpressReqWrap(target)
        )
      }
    })
  }
}
