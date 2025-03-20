import { getdata } from '@/api/axios/request'

// 页面级tab-资产管理-左侧资产树
export const getAssetTreePort = (params) => {
  return getdata('POST', `/api/tabs/assetManageTree`, params)
}

// 页面级tab-资产管理-右侧资产列表
export const getAssetManageList = (params) => {
  return getdata('POST', `/api/tabs/assetManageList`, params)
}

// 页面级tab-用户管理-用户管理列表
export const getUserManageList = (params) => {
  return getdata('POST', `/api/tabs/userManageList`, params)
}

// 页面级tab-用户管理-角色查询
export const getAccountRolePort = (params) => {
  return getdata('POST', `/api/tabs/roleDict`, params)
}

// 页面级tab-用户管理-编辑用户原数据
export const getOriginAccountInfoPort = (params) => {
  return getdata('POST', `/api/tabs/accountOriginData`, params)
}

// 账号管理-用户管理-添加用户
export const addAccountPort = (params) => {
  return getdata('POST', `/api/user/addAccount`, params)
}

// 页面级tab-用户管理-编辑用户
export const editAccountPort = (params) => {
  return getdata('POST', `/api/tabs/editAccount`, params)
}

// 页面级tab-用户管理-删除用户
export const deleteAccountListPort = (params) => {
  return getdata('POST', `/api/tabs/deleteAccount`, params)
}
