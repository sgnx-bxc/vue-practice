export default [
  // 基础表格-DNS黑名单列表
  {
    name: 'posttableblackwhitelist',
    url: 'posttableblackwhitelist',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            id: 'id1',
            domainIp: 'domainIp1',
            remark: 'remark1',
            featureTag: ['网络诈骗'],
            riskLevel: 3,
            status: 1,
            riskStatus: 0,
            createTime: 'createTime1',
            createUser: 'createUser1',
            updateTime: 'updateTime1',
            updateUser: 'updateUser1'
          },
          {
            id: 'id2',
            domainIp: 'domainIp2',
            remark: 'remark2',
            featureTag: ['网络游戏'],
            riskLevel: 2,
            status: 0,
            riskStatus: 1,
            createTime: 'createTime2',
            createUser: 'createUser2',
            updateTime: 'updateTime2',
            updateUser: 'updateUser2'
          },
          {
            id: 'id3',
            domainIp: 'domainIp3',
            remark: 'remark3',
            featureTag: ['色情网站'],
            riskLevel: 1,
            status: 0,
            riskStatus: 2,
            createTime: 'createTime3',
            createUser: 'createUser3',
            updateTime: 'updateTime3',
            updateUser: 'updateUser3'
          },
          {
            id: 'id4',
            domainIp: 'domainIp4',
            remark: 'remark4',
            featureTag: ['恶意C2'],
            riskLevel: 3,
            status: 1,
            riskStatus: 3,
            createTime: 'createTime4',
            createUser: 'createUser4',
            updateTime: 'updateTime4',
            updateUser: 'updateUser4'
          }
        ]
      }
    }
  },
  // 基础表格-资产类别获取
  {
    name: 'posttableassetTypeDict',
    url: 'posttableassetTypeDict',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            id: 1,
            createTime: '2021-03-29 14:06:03',
            description: null,
            iconPath: null,
            typeName: '工控工作站',
            parentId: 0,
            assetFamily: 1,
            isDefault: true,
            childrenTypeList: [
              {
                id: 101,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '工控工作站',
                assetChangeType: '核心资产',
                parentId: null,
                assetFamily: 1,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          },
          {
            id: 2,
            createTime: '2021-03-29 14:06:03',
            description: null,
            iconPath: null,
            typeName: '工控服务器',
            parentId: 0,
            assetFamily: 1,
            isDefault: true,
            childrenTypeList: [
              {
                id: 102,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: 'SCADA服务器',
                assetChangeType: '重要资产',
                parentId: null,
                assetFamily: 1,
                isDefault: true,
                childrenTypeList: null
              },
              {
                id: 103,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '工控服务器',
                assetChangeType: '重要资产',
                parentId: null,
                assetFamily: 1,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          },
          {
            id: 3,
            createTime: '2021-03-29 14:06:03',
            description: null,
            iconPath: null,
            typeName: '工控设备',
            parentId: 0,
            assetFamily: 1,
            isDefault: true,
            childrenTypeList: [
              {
                id: 105,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: 'HMI',
                assetChangeType: '核心资产',
                parentId: null,
                assetFamily: 1,
                isDefault: true,
                childrenTypeList: null
              },
              {
                id: 104,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: 'PLC',
                assetChangeType: '核心资产',
                parentId: null,
                assetFamily: 1,
                isDefault: true,
                childrenTypeList: null
              },
              {
                id: 106,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '工控类设备',
                assetChangeType: '核心资产',
                parentId: null,
                assetFamily: 1,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          },
          {
            id: 4,
            createTime: '2021-03-29 14:06:03',
            description: null,
            iconPath: null,
            typeName: '终端设备',
            parentId: 0,
            assetFamily: 2,
            isDefault: true,
            childrenTypeList: [
              {
                id: 108,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: 'PC',
                assetChangeType: '次要资产',
                parentId: null,
                assetFamily: 2,
                isDefault: true,
                childrenTypeList: null
              },
              {
                id: 107,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '终端设备',
                assetChangeType: '次要资产',
                parentId: null,
                assetFamily: 2,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          },
          {
            id: 5,
            createTime: '2021-03-29 14:06:03',
            description: null,
            iconPath: null,
            typeName: '服务器',
            parentId: 0,
            assetFamily: 2,
            isDefault: true,
            childrenTypeList: [
              {
                id: 110,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: 'web服务器',
                assetChangeType: '重要资产',
                parentId: null,
                assetFamily: 2,
                isDefault: true,
                childrenTypeList: null
              },
              {
                id: 109,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '服务器',
                assetChangeType: '重要资产',
                parentId: null,
                assetFamily: 2,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          },
          {
            id: 6,
            createTime: '2021-03-29 14:06:03',
            description: null,
            iconPath: null,
            typeName: '网络设备',
            parentId: 0,
            assetFamily: 2,
            isDefault: true,
            childrenTypeList: [
              {
                id: 111,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '网络设备',
                assetChangeType: '次要资产',
                parentId: null,
                assetFamily: 2,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          },
          {
            id: 7,
            createTime: '2021-03-29 14:06:03',
            description: '',
            iconPath: '',
            typeName: '未知',
            parentId: 0,
            assetFamily: null,
            isDefault: true,
            childrenTypeList: [
              {
                id: 112,
                createTime: '2021-03-29 14:06:03',
                description: '',
                iconPath: null,
                typeName: '未知设备',
                assetChangeType: '次要资产',
                parentId: null,
                assetFamily: null,
                isDefault: true,
                childrenTypeList: null
              }
            ]
          }
        ]
      }
    }
  },
  // 基础表格-执行范围获取
  {
    name: 'posttableexecuteRangeDict',
    url: 'posttableexecuteRangeDict',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            label: '华东',
            groupID: 1,
            children: [
              {
                label: '上海',
                groupID: 11,
                children: null
              },
              {
                label: '江苏',
                groupID: 12,
                children: null
              },
              {
                label: '浙江',
                groupID: 13,
                children: null
              }
            ]
          },
          {
            label: '西北',
            groupID: 2,
            children: [
              {
                label: '陕西',
                groupID: 21,
                children: null
              },
              {
                label: '新疆维吾尔族自治区',
                groupID: 22,
                children: null
              }
            ]
          }
        ]
      }
    }
  },
  // 基础表格-黑名单信息
  {
    name: 'posttableblackListInfo',
    url: 'posttableblackListInfo',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            assetName: 'a',
            assetType: [1, 101],
            assetIp: '1.1.1.1',
            assetMac: '4E-49-6C-D8-9A-E1',
            allowConnect: 1,
            blackListStatus: 1,
            startDateTime: 'defaultEmpty',
            startDate: [2, '01'],
            startTime: 3,
            featureTag: [
              24,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23
            ],
            interceptTime: ['2025-03-02', '2025-03-03'],
            excuteRange: [
              [1, 11],
              [1, 12],
              [1, 13],
              [2, 21],
              [2, 22]
            ],
            blackDomain: 'http://www.baidu.com',
            defenseIpOrIpRange: [
              {
                ipWay: 1,
                allowIp: '1.1.1.1',
                allowIpRange: ''
              }
            ],
            allowIpOrIpRange: [
              {
                ipWay: 1,
                allowIp: '1.1.1.2',
                allowIpRange: ''
              }
            ],
            remark: '1'
          }
        ]
      }
    }
  },
  // 复杂表格-TOP10高频漏洞
  {
    name: 'postcomplexTablehighFreqLeak',
    url: 'postcomplexTablehighFreqLeak',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            flawName: '允许Traceroute探测',
            flawCount: 3965
          },
          {
            flawName: 'OpenSSH 安全漏洞(CVE-2021-28041)',
            flawCount: 3000
          },
          {
            flawName: 'OpenSSH 命令注入漏洞(CVE-2020-15778)',
            flawCount: 2880
          },
          {
            flawName: 'OpenSSH 用户枚举漏洞(CVE-2018-15919)',
            flawCount: 2654
          },
          {
            flawName: 'OpenSSH 安全漏洞(CVE-2017-15906)',
            flawCount: 2444
          },
          {
            flawName: 'OpenSSH 用户枚举漏洞(CVE-2018-15473)【原理扫描】',
            flawCount: 2413
          },
          {
            flawName: 'OpenSSH CBC模式信息泄露漏洞(CVE-2008-5161)【原理扫描】',
            flawCount: 2256
          },
          {
            flawName: 'SSH版本信息可被获取',
            flawCount: 2153
          },
          {
            flawName: '探测到SSH服务器支持的算法',
            flawCount: 2024
          },
          {
            flawName: 'ICMP timestamp请求响应漏洞',
            flawCount: 2000
          }
        ]
      }
    }
  },
  // 复杂表格-漏洞资产占比
  {
    name: 'postcomplexTableassetFreqLeak',
    url: 'postcomplexTableassetFreqLeak',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            nodes: [
              {
                id: 'trend',
                label: 'Trend',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'compare',
                label: 'Compare',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'percentage',
                label: 'Percentage',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'flow',
                label: 'Flow',
                level: 1,
                size: 150,
                otherData: {
                  nodes: [
                    { id: '1', label: '1', size: 20 },
                    { id: '2', label: '2', size: 20 }
                  ],
                  edges: [
                    { source: 'flow', target: '1' },
                    { source: 'flow', target: '2' }
                  ]
                }
              },
              {
                id: 'distribution',
                label: 'Distribution',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'relation',
                label: 'Relation',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'composition',
                label: 'Composition',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'howareyou',
                label: 'Howareyou',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'areyouok',
                label: 'Areyouok',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              },
              {
                id: 'thankyou',
                label: 'Thankyou',
                level: 1,
                otherData: {
                  nodes: [],
                  edges: []
                }
              }
            ]
          }
        ]
      }
    }
  },
  // 复杂表格-网络安全事件列表
  {
    name: 'postcomplexTablenetSafeEvent',
    url: 'postcomplexTablenetSafeEvent',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            id: 1,
            assetName: 'assetName1',
            assetDistrict: 'assetDistrict1',
            assetIp: 'assetIp1',
            alarmTotal: 'alarmTotal1',
            recentTime: 'recentTime1',
            firstTime: 'firstTime1'
          },
          {
            id: 2,
            assetName: 'assetName2',
            assetDistrict: 'assetDistrict2',
            assetIp: 'assetIp2',
            alarmTotal: 'alarmTotal2',
            recentTime: 'recentTime2',
            firstTime: 'firstTime2'
          },
          {
            id: 3,
            assetName: 'assetName3',
            assetDistrict: 'assetDistrict3',
            assetIp: 'assetIp3',
            alarmTotal: 'alarmTotal3',
            recentTime: 'recentTime3',
            firstTime: 'firstTime3'
          },
          {
            id: 4,
            assetName: 'assetName4',
            assetDistrict: 'assetDistrict4',
            assetIp: 'assetIp4',
            alarmTotal: 'alarmTotal4',
            recentTime: 'recentTime4',
            firstTime: 'firstTime4'
          }
        ]
      }
    }
  },
  // 复杂表格-网络安全事件列表展开列表
  {
    name: 'postcomplexTablenetSafeEventExpand',
    url: 'postcomplexTablenetSafeEventExpand',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            updateTime: 'updateTime1',
            firstTime: 'firstTime1',
            assetName: 'assetName1',
            assetDistrict: 'assetDistrict1',
            alarmName: 'alarmName1',
            alarmDesc: 'alarmDesc1',
            alarmLevel: 1,
            sourceIp: 'sourceIp1',
            destIp: 'destIp1',
            attackStep: 'attackStep1',
            attackNum: 'attackNum1',
            alarmStatus: 0
          },
          {
            updateTime: 'updateTime2',
            firstTime: 'firstTime2',
            assetName: 'assetName2',
            assetDistrict: 'assetDistrict2',
            alarmName: 'alarmName2',
            alarmDesc: 'alarmDesc2',
            alarmLevel: 2,
            sourceIp: 'sourceIp2',
            destIp: 'destIp2',
            attackStep: 'attackStep2',
            attackNum: 'attackNum2',
            alarmStatus: 1
          },
          {
            updateTime: 'updateTime3',
            firstTime: 'firstTime3',
            assetName: 'assetName3',
            assetDistrict: 'assetDistrict3',
            alarmName: 'alarmName3',
            alarmDesc: 'alarmDesc3',
            alarmLevel: 3,
            sourceIp: 'sourceIp3',
            destIp: 'destIp3',
            attackStep: 'attackStep3',
            attackNum: 'attackNum3',
            alarmStatus: 2
          },
          {
            updateTime: 'updateTime4',
            firstTime: 'firstTime4',
            assetName: 'assetName4',
            assetDistrict: 'assetDistrict4',
            alarmName: 'alarmName4',
            alarmDesc: 'alarmDesc4',
            alarmLevel: 1,
            sourceIp: 'sourceIp4',
            destIp: 'destIp4',
            attackStep: 'attackStep4',
            attackNum: 'attackNum4',
            alarmStatus: 3
          }
        ]
      }
    }
  },
  // 表格聚合查询-告警日志列表
  {
    name: 'postcsearchTablealarmLog',
    url: 'postcsearchTablealarmLog',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            id: 1,
            recentTime: 'recentTime1',
            firstTime: 'firstTime1',
            alarmTypeName: 'alarmTypeName1',
            alarmName: 'alarmName1',
            alarmDesc: 'alarmDesc1',
            alarmLevel: 1,
            sourceIp: 'sourceIp1',
            destIp: 'destIp1',
            attackStep: 'attackStep1',
            attackNum: 'attackNum1',
            alarmStatus: 0
          },
          {
            id: 2,
            recentTime: 'recentTime2',
            firstTime: 'firstTime2',
            alarmTypeName: 'alarmTypeName2',
            alarmName: 'alarmName2',
            alarmDesc: 'alarmDesc2',
            alarmLevel: 2,
            sourceIp: 'sourceIp2',
            destIp: 'destIp2',
            attackStep: 'attackStep2',
            attackNum: 'attackNum2',
            alarmStatus: 1
          },
          {
            id: 3,
            recentTime: 'recentTime3',
            firstTime: 'firstTime3',
            alarmTypeName: 'alarmTypeName3',
            alarmName: 'alarmName3',
            alarmDesc: 'alarmDesc3',
            alarmLevel: 3,
            sourceIp: 'sourceIp3',
            destIp: 'destIp3',
            attackStep: 'attackStep3',
            attackNum: 'attackNum3',
            alarmStatus: 2
          },
          {
            id: 4,
            recentTime: 'recentTime4',
            firstTime: 'firstTime4',
            alarmTypeName: 'alarmTypeName4',
            alarmName: 'alarmName4',
            alarmDesc: 'alarmDesc4',
            alarmLevel: 1,
            sourceIp: 'sourceIp4',
            destIp: 'destIp4',
            attackStep: 'attackStep4',
            attackNum: 'attackNum4',
            alarmStatus: 3
          }
        ]
      }
    }
  },
  // 表格聚合查询-告警日志列表
  {
    name: 'postcsearchTablealarmMultDict',
    url: 'postcsearchTablealarmMultDict',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 4,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            alarmDescList: [
              'Zbot木马病毒',
              'Reyptson勒索病毒',
              'H-worm恶意软件',
              'Spora勒索病毒',
              'Dragonfly家族木马',
              'JS/Nemucod脚本病毒',
              'Win32/Travnet.A木马病毒',
              'InstallCore恶意软件',
              'Locky勒索病毒',
              'Dridex木马病毒',
              'Ramnit恶意软件',
              'Tor2Web代理访问暗网',
              'Graftor木马病毒'
            ],
            alarmNameList: ['木马病毒', '勒索软件', '恶意软件', '暗网流量'],
            alarmTypeNameList: ['恶意程序']
          }
        ]
      }
    }
  }
]
