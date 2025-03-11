// ipv4
// ip格式校验
export function checkIp(value) {
  const regExp =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/
  if (regExp.test(value)) {
    const list = value.split('.')
    // 大于两位数时，第一位不能为0
    let num = 0
    list.forEach((item) => {
      if (item.length > 1 && item[0] === '0') {
        num++
      }
    })
    return num === 0
  } else {
    return false
  }
}

// ip段校验
export function checkIpRange(value) {
  const ipItemArr = value.split('-')
  const ipItemArr0 = ipItemArr[0]
  const ipItemArr1 = ipItemArr[1]
  if (!checkIp(ipItemArr0) || !checkIp(ipItemArr1)) {
    return false
  } else {
    // 起始ip不能大于终止ip
    return compareIp(ipItemArr0, ipItemArr1)
  }
}

// 子网掩码校验，掩码只能填1-31之间的整数
export function checkIpMask(value) {
  const ipItemArr = value.split('/')
  const ipItemArr0 = ipItemArr[0]
  const ipItemArr1 = ipItemArr[1]
  if (
    !checkIp(ipItemArr0) ||
    ipItemArr1 === '' ||
    ipItemArr1 < 1 ||
    ipItemArr1 > 31
  ) {
    return false
  } else {
    if (ipItemArr1.length > 1 && ipItemArr1[0] === '0') {
      // 两位数以上，首位不能为0
      return false
    } else {
      return true
    }
  }
}

// ip范围格式校验，返回该ip范围格式是否正确、错误信息、ip总个数
// 支持输入IP号、IP区间、IP号段（24-32），多个对象间用英文逗号“,”分隔，如：192.168.10.1,192.168.10.1-192.168.10.254,192.168.10.0/24
// 返回的个数是默认了多个对象没有交集
export function checkIpDesc(value) {
  const errorMsg = '格式不正确'
  let ret = {}
  ret.flag = true
  ret.msg = ''
  ret.count = 0
  if (value === '') {
    ret.flag = false
    ret.msg = '不能为空'
  } else {
    // 分析每段格式
    const searchList = value.split(',')
    searchList.forEach((ipItem) => {
      if (ipItem.indexOf('-') !== -1) {
        // ip区间 192.168.10.1-192.168.10.254
        try {
          const ipItemArr = ipItem.split('-')
          const ipItemArr0 = ipItemArr[0]
          const ipItemArr1 = ipItemArr[1]
          if (!checkIp(ipItemArr0) || !checkIp(ipItemArr1)) {
            ret.flag = false
            ret.msg = errorMsg
            return ret
          }
          if (!compareIp(ipItemArr0, ipItemArr1)) {
            ret.flag = false
            ret.msg = errorMsg
            return ret
          }
          ret.count = ret.count + countIpRange(ipItem)
        } catch (error) {
          ret.flag = false
          ret.msg = errorMsg
          return ret
        }
      } else if (ipItem.indexOf('/') !== -1) {
        // ip号段，子网掩码 192.168.10.0/24
        try {
          const arr = (ipItem + '').split('/')
          const arr0 = arr[0]
          const arr1 = arr[1]
          if (
            parseInt(arr1) < 24 ||
            parseInt(arr1) > 32 ||
            isNaN(parseInt(arr1))
          ) {
            ret.flag = false
            ret.msg = errorMsg
            return ret
          }
          if (!checkIp(arr0)) {
            ret.flag = false
            ret.msg = errorMsg
            return ret
          }
          ret.count = ret.count + countIpSubnetMask(ipItem)
        } catch (error) {
          ret.flag = false
          ret.msg = errorMsg
          return ret
        }
      } else {
        // 单个ip
        if (!checkIp(ipItem)) {
          ret.flag = false
          ret.msg = errorMsg
          return ret
        }
        ret.count = ret.count + 1
      }
    })
  }
  return ret
}

// 比较两个ip大小，a<=b为true
export function compareIp(ipa, ipb) {
  const ipArra = ipa.split('.')
  const ipArrb = ipb.split('.')
  let flag = true
  for (let i = 0; i < 4; i++) {
    if (parseInt(ipArra[i]) > parseInt(ipArrb[i])) {
      flag = false
    }
  }
  return flag
}

// 计算ip个数，ip区间，192.168.10.1-192.168.10.254
export function countIpRange(ipItem) {
  let count = 0
  const ipItemArr = ipItem.split('-')
  const ipItem0 = ipItemArr[0]
  const ipItem1 = ipItemArr[1]
  const ipBin0 = ipToBinary(ipItem0)
  const ipBin1 = ipToBinary(ipItem1)
  count = parseInt(ipBin1, 2) - parseInt(ipBin0, 2) // 2进制转10进制
  return count
}

// 计算ip个数，ip号段，子网掩码，192.168.10.0/24或192.138.1.0/26
export function countIpSubnetMask(ipItem) {
  let count = 0
  const ipItemArr = ipItem.split('/')
  const ip = ipItemArr[0]
  const maskNum = parseInt(ipItemArr[1])
  let ipBin = ipToBinary(ip)
  ipBin = ipBin.slice(0, maskNum)
  const startIpBin = ipBin + Array(32 - maskNum).join(0)
  const endIpBin = ipBin + Array(32 - maskNum).join(1)
  count = parseInt(endIpBin, 2) - parseInt(startIpBin, 2) // 2进制转10进制
  return count
}

// ip地址转2进制
function ipToBinary(ip) {
  let ipArr = ip.split('.')
  let ret = ''
  ipArr.forEach((curNum) => {
    let bin = parseInt(curNum)
    bin = bin.toString(2) // 10进制转2进制
    bin = formatZero(bin, 8) // 补齐8位
    ret = ret + bin
  })
  return ret
}

// 位数不够，前面位数补零
function formatZero(num, len) {
  if (String(num).length < len) {
    return (Array(len).join(0) + parseInt(num)).slice(-len)
  } else {
    return num
  }
}
