// 引入 请求处理封装方法
import { getdata } from '@/api/axios/request'

// 获取登录生物滑块图片
export const getVerifyImage = (params) => {
  return getdata('GET', `/api/captcha`, params)
}

// 登录
export const logIn = (params) => {
  return getdata('POST', `/api/user/login`, params)
}

// 获取用户权限
export const welcome = (params) => {
  return getdata('POST', `/api/user/role`, params)
}

// 单点登录获取用户信息
export const getUrlInfoPort = (params) => {
  return getdata('POST', `/api/ismc/token`, params)
}

// 退出登录
export const logOut = (params) => {
  return getdata('POST', `/api/user/logout`, params)
}
