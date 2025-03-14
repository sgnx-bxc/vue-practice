import { getdata } from '@/api/axios/request'

// grid布局-获取所有卡片
export const getGridAllCardPort = (params) => {
  return getdata('POST', `/api/grid/allCard`, params)
}

// grid布局-获取卡片的布局
export const getGridLayoutPort = (params) => {
  return getdata('POST', `/api/grid/layout`, params)
}

// grid布局-保存所有卡片的布局
export const saveDashboardLayoutPort = (params) => {
  return getdata('POST', `/api/grid/saveLayout`, params)
}
