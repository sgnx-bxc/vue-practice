import { getdata } from '@/api/axios/request'

// 工作台-上方总览信息统计
export const getInstallInfoPort = (params) => {
  return getdata('POST', `/api/board/sysInfo`, params)
}

// 工作台-下方图表信息统计
export const getAllChartInfoPort = (params) => {
  return getdata('POST', `/api/board/overview`, params)
}
