// 静态数据字典列表
const allDict = {
  // 仪表盘-账号风险类型
  riskType: [
    { label: '无密码', value: 2 },
    { label: '弱口令', value: 1 },
    { label: '影子账户', value: 0 }
  ],
  // 基础表格-特征标签
  traitSignsDict: [
    { label: '网络诈骗', value: '网络诈骗' },
    { label: '网络游戏', value: '网络游戏' },
    { label: '反动宣传', value: '反动宣传' },
    { label: '网络传销', value: '网络传销' },
    { label: '色情网站', value: '色情网站' },
    { label: '赌博网站', value: '赌博网站' },
    { label: '恶意网站', value: '恶意网站' },
    { label: '恶意软件', value: '恶意软件' },
    { label: '钓鱼网站', value: '钓鱼网站' },
    { label: '恶意C2', value: '恶意C2' },
    { label: '代理', value: '代理' },
    { label: '加密货币', value: '加密货币' },
    { label: '垃圾邮件', value: '垃圾邮件' },
    { label: '洋葱路由', value: '洋葱路由' },
    { label: '勒索软件', value: '勒索软件' },
    { label: '僵尸网络', value: '僵尸网络' },
    { label: '网络扫描', value: '网络扫描' },
    { label: '恶意邮件', value: '恶意邮件' },
    { label: '其他', value: '其他' }
  ],
  // 基础表格-风险等级
  riskLevelDict: [
    { label: '高危', value: 3 },
    { label: '中危', value: 2 },
    { label: '低危', value: 1 }
  ],
  // 基础表格-风险等级样式
  riskLevelStyleDict: {
    3: 'risk-level-3',
    2: 'risk-level-2',
    1: 'risk-level-1'
  },
  // 基础表格-处置状态
  riskStatusDict: [
    {
      label: '未处置',
      value: 0
    },
    {
      label: '已处置',
      value: 1
    },
    {
      label: '已忽略',
      value: 2
    },
    {
      label: '进行中',
      value: 3
    }
  ],
  // 基础表格-处置状态样式
  riskStatusDictStyle: {
    0: 'dealNo',
    1: 'dealFinish',
    2: 'dealLose',
    3: 'dealing'
  },
  // 复杂表格-告警等级
  alarmLevelDict: [
    { label: '高危', value: 3 },
    { label: '中危', value: 2 },
    { label: '低危', value: 1 }
  ],
  // 复杂表格-告警等级样式
  alarmLevelStyleDict: {
    3: 'alarm-level-3',
    2: 'alarm-level-2',
    1: 'alarm-level-1'
  },
  // 复杂表格-处置状态
  alarmStatusDict: [
    {
      label: '未处置',
      value: 0
    },
    {
      label: '已处置',
      value: 1
    },
    {
      label: '未反馈',
      value: 2
    },
    {
      label: '已反馈',
      value: 3
    }
  ],
  // 复杂表格-处置状态样式
  alarmStatusDictStyle: {
    0: 'dealNo',
    1: 'dealFinish',
    2: 'feedbackNo',
    3: 'feedbackFinish'
  },
  // 表格聚合查询-攻击阶段
  attackStepDict: [
    {
      value: 'zhinan',
      label: '指南',
      children: [
        {
          value: 'shejiyuanze',
          label: '设计原则',
          children: [
            {
              value: 'yizhi',
              label: '一致'
            },
            {
              value: 'fankui',
              label: '反馈'
            }
          ]
        },
        {
          value: 'daohang',
          label: '导航',
          children: [
            {
              value: 'cexiangdaohang',
              label: '侧向导航'
            },
            {
              value: 'dingbudaohang',
              label: '顶部导航'
            }
          ]
        }
      ]
    },
    {
      value: 'zujian',
      label: '组件',
      children: [
        {
          value: 'basic',
          label: 'Basic',
          children: [
            {
              value: 'layout',
              label: 'Layout 布局'
            },
            {
              value: 'color',
              label: 'Color 色彩'
            },
            {
              value: 'typography',
              label: 'Typography 字体'
            },
            {
              value: 'icon',
              label: 'Icon 图标'
            },
            {
              value: 'button',
              label: 'Button 按钮'
            }
          ]
        },
        {
          value: 'form',
          label: 'Form',
          children: [
            {
              value: 'radio',
              label: 'Radio 单选框'
            },
            {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            },
            {
              value: 'input',
              label: 'Input 输入框'
            },
            {
              value: 'input-number',
              label: 'InputNumber 计数器'
            },
            {
              value: 'select',
              label: 'Select 选择器'
            },
            {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            },
            {
              value: 'switch',
              label: 'Switch 开关'
            },
            {
              value: 'slider',
              label: 'Slider 滑块'
            },
            {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            },
            {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            },
            {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            },
            {
              value: 'upload',
              label: 'Upload 上传'
            },
            {
              value: 'rate',
              label: 'Rate 评分'
            },
            {
              value: 'form',
              label: 'Form 表单'
            }
          ]
        },
        {
          value: 'data',
          label: 'Data',
          children: [
            {
              value: 'table',
              label: 'Table 表格'
            },
            {
              value: 'tag',
              label: 'Tag 标签'
            },
            {
              value: 'progress',
              label: 'Progress 进度条'
            },
            {
              value: 'tree',
              label: 'Tree 树形控件'
            },
            {
              value: 'pagination',
              label: 'Pagination 分页'
            },
            {
              value: 'badge',
              label: 'Badge 标记'
            }
          ]
        },
        {
          value: 'notice',
          label: 'Notice',
          children: [
            {
              value: 'alert',
              label: 'Alert 警告'
            },
            {
              value: 'loading',
              label: 'Loading 加载'
            },
            {
              value: 'message',
              label: 'Message 消息提示'
            },
            {
              value: 'message-box',
              label: 'MessageBox 弹框'
            },
            {
              value: 'notification',
              label: 'Notification 通知'
            }
          ]
        },
        {
          value: 'navigation',
          label: 'Navigation',
          children: [
            {
              value: 'menu',
              label: 'NavMenu 导航菜单'
            },
            {
              value: 'tabs',
              label: 'Tabs 标签页'
            },
            {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            },
            {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            },
            {
              value: 'steps',
              label: 'Steps 步骤条'
            }
          ]
        },
        {
          value: 'others',
          label: 'Others',
          children: [
            {
              value: 'dialog',
              label: 'Dialog 对话框'
            },
            {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            },
            {
              value: 'popover',
              label: 'Popover 弹出框'
            },
            {
              value: 'card',
              label: 'Card 卡片'
            },
            {
              value: 'carousel',
              label: 'Carousel 走马灯'
            },
            {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }
          ]
        }
      ]
    },
    {
      value: 'ziyuan',
      label: '资源',
      children: [
        {
          value: 'axure',
          label: 'Axure Components'
        },
        {
          value: 'sketch',
          label: 'Sketch Templates'
        },
        {
          value: 'jiaohu',
          label: '组件交互文档'
        }
      ]
    }
  ],
  // 页面级tab-资产活跃度字典
  assetActiveTagDict: [
    { label: '12小时不活跃', value: 0 },
    { label: '24小时不活跃', value: 1 },
    { label: '7天不活跃', value: 2 },
    { label: '30天不活跃', value: 3 }
  ],
  // 是否
  ifDict: [
    { label: '是', value: 1 },
    { label: '否', value: 0 }
  ],
  // 时间
  timeDict: [
    {
      label: '0:00',
      value: 24
    },
    {
      label: '1:00',
      value: 1
    },
    {
      label: '2:00',
      value: 2
    },
    {
      label: '3:00',
      value: 3
    },
    {
      label: '4:00',
      value: 4
    },
    {
      label: '5:00',
      value: 5
    },
    {
      label: '6:00',
      value: 6
    },
    {
      label: '7:00',
      value: 7
    },
    {
      label: '8:00',
      value: 8
    },
    {
      label: '9:00',
      value: 9
    },
    {
      label: '10:00',
      value: 10
    },
    {
      label: '11:00',
      value: 11
    },
    {
      label: '12:00',
      value: 12
    },
    {
      label: '13:00',
      value: 13
    },
    {
      label: '14:00',
      value: 14
    },
    {
      label: '15:00',
      value: 15
    },
    {
      label: '16:00',
      value: 16
    },
    {
      label: '17:00',
      value: 17
    },
    {
      label: '18:00',
      value: 18
    },
    {
      label: '19:00',
      value: 19
    },
    {
      label: '20:00',
      value: 20
    },
    {
      label: '21:00',
      value: 21
    },
    {
      label: '22:00',
      value: 22
    },
    {
      label: '23:00',
      value: 23
    }
  ],
  // ip方式
  ipWayDict: [
    { label: 'IP', value: 1 },
    { label: 'IP段', value: 2 }
  ]
}

// 字典表数组字段转换
export function setdictKey(dict, oldK, newK) {
  dict.forEach((item) => {
    item[newK] = item[oldK]
  })
  return dict
}

// 字典表数组转换为对象映射关系
export function getdictMap(dict, label) {
  const map = {}
  dict.forEach((item) => {
    map[item[label]] = item
  })
  return map
}

// 字典表数据转换label（label），value（value）
export function convertDictData(dictMap, label, value) {
  let newDictMap = JSON.parse(JSON.stringify(dictMap))
  for (const key in newDictMap) {
    if (Object.prototype.hasOwnProperty.call(newDictMap, key)) {
      let dictList = newDictMap[key]
      dictList.forEach((item) => {
        item.label = item[label]
        item.value = item[value]
      })
    }
  }
  return newDictMap
}

export default allDict
