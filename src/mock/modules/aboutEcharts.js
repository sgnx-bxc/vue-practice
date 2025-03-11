export default [
  // 上方总览信息统计
  {
    name: 'postboardsysInfo',
    url: 'postboardsysInfo',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 1,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            Exp: 1,
            expDate: '2023-11-14 00:00:00',
            runDate: '252',
            version: 'v1.0'
          }
        ]
      }
    }
  },
  // 下方图表信息统计
  {
    name: 'postboardoverview',
    url: 'postboardoverview',
    type: 'post',
    response: (option) => {
      return {
        success: true,
        msg: 'success.',
        errorCode: 110000,
        total: 1,
        pageSize: 1,
        pageNum: 1,
        pages: 1,
        list: [
          {
            assetStatistic: {
              agentCount: 108,
              expCount: 0,
              offCount: 87,
              onlineCount: 21,
              agentType: [
                { type: 'win-pc', count: 44 },
                { type: 'linux', count: 54 },
                { type: 'win-server', count: 10 },
                { type: 'other', count: 0 }
              ]
            },
            alarmLevel: {
              high: 46,
              low: 8701,
              middle: 73,
              total: 8820
            },
            alarmTags: [
              { alarmTags: 'MaliciousDoc', unHStatus: 37, hCount: 38 },
              { alarmTags: 'Ransomware', unHStatus: 4, hCount: 4 },
              { alarmTags: 'Hacktools', unHStatus: 2, hCount: 2 },
              { alarmTags: 'Defense_evasion', unHStatus: 1, hCount: 1 },
              { alarmTags: 'Trojan', unHStatus: 1, hCount: 1 }
            ],
            alarmEventTrend: {
              file: 1234,
              process: 2345,
              autoStart: 56,
              log: 2567,
              monitor: 78,
              alarmCurrent: [
                {
                  x: 10.1,
                  y: 35,
                  date: '2023-10-01'
                },
                {
                  x: 10.2,
                  y: 25,
                  date: '2023-10-02'
                },
                {
                  x: 10.3,
                  y: 45,
                  date: '2023-10-03'
                },
                {
                  x: 10.4,
                  y: 35,
                  date: '2023-10-04'
                },
                {
                  x: 10.5,
                  y: 55,
                  date: '2023-10-05'
                },
                {
                  x: 10.6,
                  y: 45,
                  date: '2023-10-06'
                },
                {
                  x: 10.7,
                  y: 65,
                  date: '2023-10-07'
                }
              ]
            },
            alarmOverviewInGroup: [
              {
                group: '办公互联网1',
                count: 50,
                agents: [
                  { agentName: 'RN11286XXX', count: 9 },
                  { agentName: 'RN11287XXX', count: 8 },
                  { agentName: 'RN11288XXX', count: 7 },
                  { agentName: 'RN11289XXX', count: 6 },
                  { agentName: 'RN11290XXX', count: 5 }
                ]
              },
              {
                group: '办公互联网2',
                count: 30,
                agents: [
                  { agentName: 'RN11286XXX', count: 19 },
                  { agentName: 'RN11287XXX', count: 15 },
                  { agentName: 'RN11288XXX', count: 10 },
                  { agentName: 'RN11289XXX', count: 6 }
                ]
              },
              {
                group: '办公互联网3',
                count: 20,
                agents: [
                  { agentName: 'RN11286XXX', count: 49 },
                  { agentName: 'RN11287XXX', count: 8 },
                  { agentName: 'RN11288XXX', count: 7 }
                ]
              },
              {
                group: '办公互联网4',
                count: 10,
                agents: [
                  { agentName: 'RN11286XXX', count: 49 },
                  { agentName: 'RN11287XXX', count: 48 }
                ]
              },
              {
                group: '办公互联网5',
                count: 10,
                agents: [{ agentName: 'RN11286XXX', count: 100 }]
              }
            ],
            userRisk: [
              { name: 1, count: 27 },
              { name: 2, count: 126 },
              { name: 0, count: 1 }
            ],
            vul: [
              {
                agentName: 'RN11286XXX',
                count: 4364,
                osType: 'Microsoft Windows 11 专业版'
              },
              {
                agentName: 'RN11287XXX',
                count: 3789,
                osType: 'Microsoft Windows X 专业版'
              },
              {
                agentName: 'RN11288XXX',
                count: 2582,
                osType: 'Microsoft Windows 9 专业版'
              },
              {
                agentName: 'RN11289XXX',
                count: 1673,
                osType: 'Microsoft Windows 8 专业版'
              },
              {
                agentName: 'RN11290XXX',
                count: 892,
                osType: 'Microsoft Windows 7 专业版'
              }
            ],
            alarmApp: {
              riskAppList: [
                { name: '软件1', count: 55 },
                { name: '软件2', count: 49 },
                { name: '软件3', count: 35 },
                { name: '软件4', count: 30 },
                { name: '软件5', count: 28 }
              ],
              appAlarmList: [
                { name: '软件5', count: 95 },
                { name: '软件4', count: 76 },
                { name: '软件3', count: 70 },
                { name: '软件2', count: 65 },
                { name: '软件1', count: 50 }
              ]
            },
            baseline: {
              recordCount: 90,
              riskAgent: 11,
              taskCount: 25,
              ratioClass: [
                { name: '最佳安全实践', count: 70 },
                { name: '等级保护2.0', count: 35 },
                { name: '自定义', count: 15 }
              ],
              agents: [
                { agentName: 'RN11286XXX', count: 320 },
                { agentName: 'RN11287XXX', count: 193 },
                { agentName: 'RN11288XXX', count: 237 },
                { agentName: 'RN11289XXX', count: 185 },
                { agentName: 'RN11290XXX', count: 109 }
              ]
            },
            soapCont: [
              {
                name: '腾讯QQ',
                num: 100
              },
              {
                name: '微信',
                num: 85
              },
              {
                name: 'VScode',
                num: 50
              },
              {
                name: 'Chrome',
                num: 90
              },
              {
                name: 'Typora',
                num: 36
              },
              {
                name: 'JetBrains',
                num: 45
              },
              {
                name: '腾讯会议',
                num: 60
              },
              {
                name: '百度网盘',
                num: 30
              },
              {
                name: 'WPS',
                num: 86
              },
              {
                name: 'QQ音乐',
                num: 30
              }
            ],
            databaseCont: [
              {
                name: 'MySQL',
                num: 100
              },
              {
                name: 'Oracle',
                num: 90
              },
              {
                name: 'SQLite',
                num: 46
              },
              {
                name: 'Redis',
                num: 90
              }
            ],
            reportCount: [
              {
                title: '标题A',
                value1: 4200,
                value2: 3000
              },
              {
                title: '标题B',
                value1: 4200,
                value2: 3700
              },
              {
                title: '标题C',
                value1: 4200,
                value2: 4400
              },
              {
                title: '标题D',
                value1: 4200,
                value2: 2800
              },
              {
                title: '标题E',
                value1: 4200,
                value2: 3800
              },
              {
                title: '标题F',
                value1: 4200,
                value2: 4200
              },
              {
                title: '标题G',
                value1: 4200,
                value2: 3200
              },
              {
                title: '标题H',
                value1: 4200,
                value2: 4700
              },
              {
                title: '标题I',
                value1: 4200,
                value2: 5000
              }
            ],
            flowInfo: [
              { date: '一月', in: 295, out: 250 },
              { date: '二月', in: 227, out: 42 },
              { date: '三月', in: 174, out: 333 },
              { date: '四月', in: 289, out: 210 },
              { date: '五月', in: 340, out: 149 },
              { date: '六月', in: 75, out: 149 }
            ],
            highPrecent: 0.3
          }
        ]
      }
    }
  }
]
