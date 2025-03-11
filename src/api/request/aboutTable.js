import { getdata, exportReq } from '@/api/axios/request'

// 基础表格-DNS黑名单列表
export const getWhiteOrBlackList = (params) => {
  return getdata('POST', `/api/table/blackwhitelist`, params)
}

// 基础表格-黑名单状态修改
export const updateListStatusPort = (params) => {
  return getdata('POST', `/api/table/blackwhiteSwitch`, params)
}

// 基础表格-资产类别获取
export const getAssetTypePort = (params) => {
  return getdata('POST', `/api/table/assetTypeDict`, params)
}

// 基础表格-执行范围获取
export const getExecuteRangePort = (params) => {
  return getdata('POST', `/api/table/executeRangeDict`, params)
}

// 基础表格-删除列表
export const deleteBlackListPort = (params) => {
  return getdata('POST', `/api/table/blackListDelete`, params)
}

// 基础表格-黑名单信息
export const getOriginBlackInfoPort = (params) => {
  return getdata('POST', `/api/table/blackListInfo`, params)
}

// 基础表格-新增黑名单
export const addBlackListPort = (params) => {
  return getdata('POST', `/api/table/blackListAdd`, params)
}

// 基础表格-编辑黑名单
export const editBlackListPort = (params) => {
  return getdata('POST', `/api/table/blackListEdit`, params)
}

// 复杂表格-TOP10高频漏洞
export const getHighFreqLeakPort = (params) => {
  return getdata('POST', `/api/complexTable/highFreqLeak`, params)
}

// 复杂表格-漏洞资产占比
export const getAssetFreqLeakPort = (params) => {
  return getdata('POST', `/api/complexTable/assetFreqLeak`, params)
}

// 复杂表格-网络安全事件列表
export const getNetSafeList = (params) => {
  return getdata('POST', `/api/complexTable/netSafeEvent`, params)
}

// 复杂表格-网络安全事件列表展开列表
export const safeEventDetailList = (params) => {
  return getdata('POST', `/api/complexTable/netSafeEventExpand`, params)
}

// 复杂表格-导出
export const exportAlarmPort = (params) => {
  return exportReq('POST', `/api/complexTable/netSafeEvent`, params)
}

// 表格聚合查询-告警日志列表
export const getAlarmLogList = (params) => {
  return getdata('POST', `/api/csearchTable/alarmLog`, params)
}

// 表格聚合查询-删除列表
export const deleteAlarmLogPort = (params) => {
  return getdata('POST', `/api/csearchTable/alarmLogDelete`, params)
}

// 表格聚合查询-表格多选字段字典
export const getAlarmMultDictPort = (params) => {
  return getdata('POST', `/api/csearchTable/alarmMultDict`, params)
}
