import { getdata } from '@/api/axios/request'

// 基础G6-关系图数据
export const getBaseG6InfoPort = (params) => {
  return getdata('POST', `/api/g6orx6/baseg6Info`, params)
}
