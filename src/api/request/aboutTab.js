import { getdata } from '@/api/axios/request'

// 页面级tab-资产管理-左侧资产树
export const getAssetTreePort = (params) => {
  return getdata('POST', `/api/tabs/assetManageTree`, params)
}

// 页面级tab-资产管理-右侧资产列表
export const getAssetManageList = (params) => {
  return getdata('POST', `/api/tabs/assetManageList`, params)
}
