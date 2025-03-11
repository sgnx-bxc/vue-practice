import { getdata } from '@/api/axios/request'

// 账号管理-查询用户
export const getUsers = (params) => {
  return getdata('POST', `/api/user/list`, params)
}

// 账号管理-查询角色
export const getRoles = (params) => {
  return getdata('POST', `/api/role/list`, params)
}

// 账号管理-添加用户
export const addUserPort = (params) => {
  return getdata('POST', `/api/user/add`, params)
}

// 账号管理-修改用户
export const editUserPort = (params) => {
  return getdata('POST', `/api/user/edit`, params)
}

// 账号管理-获取安全问题
export const getQuesListPort = (params) => {
  return getdata('POST', `/api/user/question/list`, params)
}

// 账号管理-登录时修改默认密码
export const updateUserDefaultPwd = (params) => {
  return getdata('POST', `/api/user/init`, params)
}

// 账号管理-首次登录修改默认密码
export const updateUserPwd = (params) => {
  return getdata('POST', `/api/user/init`, params)
}

// 账号管理-修改密码
export const getModPasswordPort = (params) => {
  return getdata('POST', `/api/user/password/edit`, params)
}
