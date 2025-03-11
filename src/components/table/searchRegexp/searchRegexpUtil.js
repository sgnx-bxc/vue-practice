import { checkIp, checkIpRange } from '@/utils/ipv4Util'
import allDict, { getdictMap } from '@/utils/dict'

// 告警等级字典
let alarmLevel = JSON.parse(JSON.stringify(allDict.alarmLevelDict))

// 可选字段属性label/value，运算符列表symbolList(label,value,inputType（输入类型1枚举2文本3两文本），placeholderText)，枚举有枚举列表valueList(label,value)
const propList = [
  {
    label: '源IP',
    value: 'source_ip',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入IP'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入IP'
      },
      {
        label: '范围(between)',
        value: 'between',
        inputType: 3,
        placeholderText: '输入IP'
      }
    ]
  },
  {
    label: '目的IP',
    value: 'dest_ip',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入IP'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入IP'
      },
      {
        label: '范围(between)',
        value: 'between',
        inputType: 3,
        placeholderText: '输入IP'
      }
    ]
  },
  {
    label: '传输层协议',
    value: 'trans_protocol',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入协议'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入协议'
      }
    ]
  },
  {
    label: '应用层协议',
    value: 'app_protocol',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入协议'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入协议'
      }
    ]
  },
  {
    label: '告警等级',
    value: 'alarm_level',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 1,
        placeholderText: '单选'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 1,
        placeholderText: '单选'
      }
    ],
    valueList: alarmLevel
  },
  {
    label: '告警名称',
    value: 'alarm_name',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入全名'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入全名'
      },
      {
        label: '包含(like)',
        value: 'like',
        inputType: 2,
        placeholderText: '模糊匹配'
      },
      {
        label: '不包含(not like)',
        value: 'not like',
        inputType: 2,
        placeholderText: '模糊匹配'
      }
    ]
  },
  {
    label: '告警类别',
    value: 'alarm_type',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入全名'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入全名'
      },
      {
        label: '包含(like)',
        value: 'like',
        inputType: 2,
        placeholderText: '模糊匹配'
      },
      {
        label: '不包含(not like)',
        value: 'not like',
        inputType: 2,
        placeholderText: '模糊匹配'
      }
    ]
  },
  {
    label: '设备IP',
    value: 'safety_device_address',
    symbolList: [
      {
        label: '等于(==)',
        value: '==',
        inputType: 2,
        placeholderText: '输入IP'
      },
      {
        label: '不等于(!=)',
        value: '!=',
        inputType: 2,
        placeholderText: '输入IP'
      }
    ]
  }
]

const propListMap = getdictMap(propList, 'value')

// 获取筛选字段的配置
export function getPropList() {
  return propList
}

// 必填项检查
function checkMustKeys(obj) {
  const mustKeys = ['name', 'operator', 'inputType', 'value']
  let isErr = false
  let errMsg = ''
  mustKeys.forEach((key) => {
    const value = obj[key]
    if (value === undefined || value === '') {
      isErr = true
      errMsg = '请完成所有关键字过滤表单项字段的填写'
    }
  })
  // ip相关校验
  if (obj.propLable.indexOf('IP') !== -1) {
    if (obj.operator === 'between') {
      if (
        obj.value1 === undefined ||
        obj.value1 === '' ||
        obj.value2 === undefined ||
        obj.value2 === ''
      ) {
        isErr = true
        errMsg = '请完成所有关键字过滤表单项字段的填写'
      } else if (!checkIpRange(`${obj.value1}-${obj.value2}`)) {
        isErr = true
        errMsg = 'IP段格式不正确'
      }
    } else if (!checkIp(obj.value)) {
      isErr = true
      errMsg = 'IP地址格式不正确'
    }
  }
  return { isErr, errMsg }
}

// 根据数据获取关键字表达式字符串
export function getRootStr(datas) {
  const rootType = datas.flag
  const rootList = datas.list
  const rootArr = []
  let isErr = false
  let rootStr = ''
  let errMsg = ''
  rootList.forEach((rootItem) => {
    // 条件组层一
    if (rootItem.regType === 1) {
      rootArr.push(
        `(${rootItem.propLable} ${rootItem.operator} ${rootItem.valueLable})`
      )
      const checkret = checkMustKeys(rootItem)
      if (checkret.isErr) {
        isErr = true
        errMsg = checkret.errMsg
      }
    } else {
      const subType = rootItem.flag
      const subList = rootItem.list
      const subArr = []
      subList.forEach((subItem) => {
        // 条件组层二
        const checkret = checkMustKeys(subItem)
        if (checkret.isErr) {
          isErr = true
          errMsg = checkret.errMsg
        }
        subArr.push(
          `(${subItem.propLable} ${subItem.operator} ${subItem.valueLable})`
        )
      })
      const subStr = subArr.join(` ${subType} `)
      rootArr.push(`{${subStr}}`)
    }
  })
  // 拼接最终语句
  rootStr = rootArr.join(` ${rootType} `)
  return {
    isErr,
    rootStr,
    errMsg
  }
}

// 单项参数校验
function checkProps(obj) {
  let isErr = false
  const propObj = propListMap[obj.name] || {}
  if (Object.keys(propObj).length === 0) {
    // 校验字段存不存在
    isErr = true
  } else {
    const symbolList = propObj.symbolList || []
    const symbolListMap = getdictMap(symbolList, 'value')
    const symbolObj = symbolListMap[obj.operator] || {}
    if (Object.keys(symbolObj).length === 0) {
      // 校验运算符存不存在
      isErr = true
    } else if (symbolObj.inputType === 1) {
      // 校验下拉框选项值存不存在
      const valueList = propObj.valueList || []
      const valueListMap = getdictMap(valueList, 'value')
      const valueObj = valueListMap[obj.value] || {}
      if (Object.keys(valueObj).length === 0) {
        isErr = true
      }
    }
  }
  return { isErr }
}

// 检查每一项配置参数。用于配置项需求修改时，对已落库的策略进行校验，提示用户修改后重新查询
export function checkDataProps(datas) {
  const rootList = datas.list
  let isErr = false
  let errMsg = ''
  rootList.forEach((rootItem) => {
    // 条件组层一
    if (rootItem.regType === 1) {
      const checkret = checkProps(rootItem)
      if (checkret.isErr) {
        isErr = true
        errMsg = '抱歉，部分过滤条件已不支持，请重新排查后设置'
      }
    } else {
      const subList = rootItem.list
      subList.forEach((subItem) => {
        // 条件组层二
        if (subItem.regType === 1) {
          const checkret = checkProps(subItem)
          if (checkret.isErr) {
            isErr = true
            errMsg = '抱歉，部分过滤条件已不支持，请重新排查后设置'
          }
        }
      })
    }
  })
  return {
    isErr,
    errMsg
  }
}
