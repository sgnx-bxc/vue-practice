/**
 * 校验工具类
 */
// ipv4
// ip格式校验在ipv4Util.js
// import { checkIp } from '@/utils/ipv4Util'

// url格式
export function checkUrl(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

// 邮箱
export function checkEmail(value) {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ // email
  if (!(value === null || value === undefined || value === '')) {
    return mailReg.test(value)
  } else {
    return true
  }
}

// 字符串
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

// 数组
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// mac
export function checkMac(value) {
  const regExp1 = /^[A-Fa-f0-9]{2}(:[A-Fa-f0-9]{2}){5}$/
  const regExp2 = /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$|^[A-F0-9]{2}(:[A-F0-9]{2}){5}$|^[A-F0-9]{12}$|^[A-F0-9]{4}(\.[A-F0-9]{4}){2}$/
  return regExp1.test(value) || regExp2.test(value)
}

// 手机号
export function checkMobile(value) {
  const isMob = /^1(3|4|5|6|7|8|9)\d{9}$/
  if (!(value === null || value === undefined || value === '')) {
    return isMob.test(value)
  } else {
    return true
  }
}

// 特殊字符校验
export function checkSpecial(value) {
  const regEn = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/im
  if (!(value === null || value === undefined || value === '')) {
    return regEn.test(value)
  } else {
    return true
  }
}
