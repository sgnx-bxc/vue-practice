// 判断websocket协议
export function wsOrWss() {
  let result = ''
  if (window.location.protocol === 'http:') {
    result = 'ws'
  } else {
    result = 'wss'
  }
  return result
}

// 数组转换为对象
export function arrayToObject(arr, key, value) {
  const result = {}
  arr.forEach((item) => {
    result[item[key]] = item[value]
  })
  return result
}

// 对象转换为数组
export function objectToArray(obj) {
  const result = Object.values(obj)
  return result
}

// 位数不够，前面位数补零
export function addLeadingZero(num, length) {
  return num.toString().padStart(length, '0')
}

// 生成一年中所有的月日（参数传递后获取指定年的月日，若没传，获取当前的月日）
export function generateDateOptions(needYear) {
  let year
  if (needYear) {
    year = needYear
  } else {
    const currentDate = new Date()
    year = currentDate.getFullYear() // 获取当前年份
  }
  const options = [] // 按照 Cascader 组件的要求构造数据结构
  // 生成一年中所有的日期列表，格式为月-日
  for (let month = 1; month <= 12; month++) {
    const lastDayOfMonth = new Date(year, month, 0).getDate() // 获取每个月份的最后一天
    const days = []

    for (let day = 1; day <= lastDayOfMonth; day++) {
      const date = `${day.toString().padStart(2, '0')}`
      days.push({ value: date, label: date }) // 构造数据结构
    }
    if (days.length > 0) {
      options.push({
        value: month,
        label: `${month}月`,
        children: days
      })
    }
  }
  return options
}

// 获取限制长度的字符串
export function getLimitLenString(string, maxLen, limit = true) {
  // 中文算2长度，英文算1长度
  let ml = maxLen || 8
  let len = 0
  let str = string || ''
  let newStrArr = []
  let newStr = ''
  let overflag = false
  for (let i = 0; i < str.length; i++) {
    let char = str[i]
    let charCode = str.charCodeAt(i)
    if (charCode > 127 || charCode === 94) {
      len += 2
    } else {
      len++
    }
    if (len <= ml) {
      newStrArr.push(char)
    } else {
      newStr = newStrArr.join('') + '...'
      overflag = true
      break
    }
  }
  if (!overflag) {
    newStr = newStrArr.join('')
  }
  return limit ? newStr : string
}

// 数字千分符
export function numberThousand(val) {
  let result = '--'
  if (val || val === 0) {
    result = parseInt(val).toLocaleString()
  }
  return result
}

// 将树形结构转化为二维数组
export function flattenTree(tree, uniqueId, path = []) {
  const result = []
  for (const node of tree) {
    const currentPath = [...path, node[uniqueId]]
    if (node.children && node.children.length > 0) {
      result.push(...flattenTree(node.children, uniqueId, currentPath))
    } else {
      result.push(currentPath)
    }
  }
  return result
}

// 判断某个数组是否存在于二维数组中
export function isArrContained(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (
      arr[i].length === target.length &&
      arr[i].every((val, index) => val === target[index])
    ) {
      return true
    }
  }
  return false
}

// 深度合并对象
export function deepObjectMerge(FirstOBJ, SecondOBJ) {
  // 深度合并对象
  for (let key in SecondOBJ) {
    FirstOBJ[key] =
      FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
        ? deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
        : (FirstOBJ[key] = SecondOBJ[key])
  }
  return FirstOBJ
}

// 添加到数组
export function addVal2Arr(array, newItem, key = 'id') {
  const isObject = (val) =>
    Object.prototype.toString.call(val) === '[object Object]'
  const exists = isObject(newItem)
    ? array.some((obj) => obj[key] === newItem[key])
    : array.includes(newItem)
  return exists ? [...array] : [...array, newItem]
}
