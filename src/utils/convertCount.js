// 十进制数据单位转换。c为数值，toFixed为保留的小数位数，有key只返回当前key对应的值
export function convertCount(c, toFixed = 0, key = null) {
  let count = c || 0
  count = parseFloat(count)
  let countStr = ''
  let unit = ''
  let flag = true
  let num = ''
  if (count / 10000 < 1) {
    flag = false
    countStr = count.toFixed(0)
  } else if (count / Math.pow(10000, 2) < 1) {
    num = count / Math.pow(10000, 1)
    unit = '万'
  } else {
    num = count / Math.pow(10000, 2)
    unit = '亿'
  }
  if (flag) {
    // 190000 = 19万，191000 = 19.1万，191800 = 19.18万，199999 = 19.99万
    countStr = mineToFixed(num, toFixed)
  }
  const item = {
    value: countStr,
    unit: unit
  }
  return key ? item[key] : item
}

// 十进制数据单位转换。c为数值，toFixed为保留的小数位数，有key只返回当前key对应的值。亿单位为万，万亿单位为亿
export function convertCountFour(c, toFixed = 0, key = null) {
  let count = c || 0
  count = parseFloat(count)
  let countStr = ''
  let unit = ''
  let flag = true
  let num = ''
  if (count / 100000000 < 1) {
    flag = false
    countStr = count.toFixed(0)
  } else if (count / Math.pow(1000000, 2) < 1) {
    num = count / Math.pow(10000, 1)
    unit = '万'
  } else {
    num = count / Math.pow(10000, 2)
    unit = '亿'
  }
  if (flag) {
    // 190000000 = 19000万，191000000 = 19100万，191800000 = 19180万，199999000 = 19990万
    countStr = mineToFixed(num, toFixed)
  }
  const item = {
    value: countStr,
    unit: unit
  }
  return key ? item[key] : item
}

// 二进制单位转换，参数单位B。v为数值，toFixed为保留的小数位数，有key只返回当前key对应的值
export function convertCountBinary(v, toFixed = 2, key = null) {
  let value = v || 0
  value = parseFloat(value)
  if (Number.isNaN(value)) {
    value = 0
  }
  let valueStr = ''
  let unit = ''
  let flag = true
  let num = ''
  if (value / 1024 < 1) {
    flag = false
    valueStr = value.toFixed(0)
    unit = 'B'
  } else if (value / Math.pow(1024, 2) < 1) {
    num = value / 1024
    unit = 'KB'
  } else if (value / Math.pow(1024, 3) < 1) {
    num = value / Math.pow(1024, 2)
    unit = 'MB'
  } else if (value / Math.pow(1024, 4) < 1) {
    num = value / Math.pow(1024, 3)
    unit = 'GB'
  } else if (value / Math.pow(1024, 5) < 1) {
    num = value / Math.pow(1024, 4)
    unit = 'TB'
  } else if (value / Math.pow(1024, 6) < 1) {
    num = value / Math.pow(1024, 5)
    unit = 'PB'
  } else if (value / Math.pow(1024, 7) < 1) {
    num = value / Math.pow(1024, 6)
    unit = 'EB'
  } else if (value / Math.pow(1024, 8) < 1) {
    num = value / Math.pow(1024, 7)
    unit = 'ZB'
  } else if (value / Math.pow(1024, 9) < 1) {
    num = value / Math.pow(1024, 8)
    unit = 'YB'
  } else {
    num = value / Math.pow(1024, 9)
    unit = 'BB'
  }
  if (flag) {
    valueStr = mineToFixed(num, toFixed)
  }
  const item = {
    value: valueStr,
    unit: unit
  }
  return key ? item[key] : item
}

// 速率
export function convertCountBite(v, toFixed = 2, key = null) { // bps
  let value = v || 0
  value = parseFloat(value)
  if (Number.isNaN(value)) {
    value = 0
  }
  let valueStr = ''
  let unit = ''
  let flag = true
  let num = ''
  if (value / 1024 < 1) {
    num = value
    unit = 'bps'
  } else if (value / Math.pow(1024, 2) < 1) {
    num = value / 1024
    unit = 'Kbps'
  } else if (value / Math.pow(1024, 3) < 1) {
    num = value / Math.pow(1024, 2)
    unit = 'Mbps'
  } else if (value / Math.pow(1024, 4) < 1) {
    num = value / Math.pow(1024, 3)
    unit = 'Gbps'
  } else if (value / Math.pow(1024, 5) < 1) {
    num = value / Math.pow(1024, 3)
    unit = 'Tbps'
  }
  if (flag) {
    valueStr = mineToFixed(num, toFixed)
  }
  const item = {
    value: valueStr,
    unit: unit
  }
  return key ? item[key] : item
}

// 速率 Bps
export function convertCountBites(v, toFixed = 2, key = null) { // Bps
  let value = v || 0
  value = parseFloat(value)
  if (Number.isNaN(value)) {
    value = 0
  }
  let valueStr = ''
  let unit = ''
  let flag = true
  let num = ''
  if (value / 1024 < 1) {
    num = value
    unit = 'Bps'
  } else if (value / Math.pow(1024, 2) < 1) {
    num = value / 1024
    unit = 'KBps'
  } else if (value / Math.pow(1024, 3) < 1) {
    num = value / Math.pow(1024, 2)
    unit = 'MBps'
  } else if (value / Math.pow(1024, 4) < 1) {
    num = value / Math.pow(1024, 3)
    unit = 'GBps'
  } else if (value / Math.pow(1024, 5) < 1) {
    num = value / Math.pow(1024, 3)
    unit = 'TBps'
  }
  if (flag) {
    valueStr = mineToFixed(num, toFixed)
  }
  const item = {
    value: valueStr,
    unit: unit
  }
  return key ? item[key] : item
}

// 因为toFixed方法会将数据四舍五入，需要特殊处理，不将数据进行四舍五入
export function mineToFixed(number, toFixed) {
  let num = number
  let valueStr = ''
  if (toFixed === 0) {
    // 不保留小数位直接向下舍去
    valueStr = Math.floor(num)
  } else {
    num = num + ''
    if (num.indexOf('.') !== -1) {
      // 有小数位的处理
      const numArr = num.split('.')
      numArr[1] = numArr[1].substr(0, toFixed)
      valueStr = numArr.join('.')
    } else {
      // 没有小数位直接返回
      valueStr = num
    }
  }
  return valueStr
}

// 获取单位类型对应的值
export function getValue(v, unitType = 0, toFixed = 2) {
  let value = v
  if (unitType === 1) {
    value = convertCount(value, toFixed)
    value = value.value + value.unit
  } else if (unitType === 2) {
    value = convertCountBinary(value, toFixed)
    value = value.value + value.unit
  } else if (unitType === 3) {
    value = convertCountBite(value, toFixed)
    value = value.value + value.unit
  }
  return value
}
