export default [
  // 所有卡片
  {
    name: 'postgridallCard',
    url: 'postgridallCard',
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
            cardId: 1,
            cardName: '安全态势',
            cardValue: 'safeTrend'
          },
          {
            cardId: 2,
            cardName: '告警事件',
            cardValue: 'alarmEvent'
          },
          {
            cardId: 3,
            cardName: '告警事件类别',
            cardValue: 'alarmType'
          },
          {
            cardId: 4,
            cardName: '资产统计',
            cardValue: 'assetCount'
          },
          {
            cardId: 5,
            cardName: '攻击链',
            cardValue: 'attackChain'
          },
          {
            cardId: 6,
            cardName: '失陷资产',
            cardValue: 'lostAssets'
          },
          {
            cardId: 7,
            cardName: '资产漏洞',
            cardValue: 'assetLeak'
          },
          {
            cardId: 8,
            cardName: '流量趋势',
            cardValue: 'flawTrend'
          },
          {
            cardId: 9,
            cardName: '协议分布',
            cardValue: 'protocolSpread'
          }
        ]
      }
    }
  },
  // 卡片布局
  {
    name: 'postgridlayout',
    url: 'postgridlayout',
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
            col: 0,
            row: 0,
            cardId: 1
          },
          {
            col: 1,
            row: 0,
            cardId: 2
          },
          {
            col: 2,
            row: 0,
            cardId: 3
          },
          {
            col: 0,
            row: 1,
            cardId: 4
          },
          {
            col: 1,
            row: 1,
            cardId: 5
          },
          {
            col: 2,
            row: 1,
            cardId: 6
          },
          {
            col: 0,
            row: 2,
            cardId: 7
          },
          {
            col: 1,
            row: 2,
            cardId: 8
          },
          {
            col: 2,
            row: 2,
            cardId: 9
          }
        ]
      }
    }
  }
]
