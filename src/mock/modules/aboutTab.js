export default [
  // 页面级tab-资产管理-左侧资产树
  {
    name: 'posttabsassetManageTree',
    url: 'posttabsassetManageTree',
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
                isDefault: true
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
  // 页面级tab-资产管理-右侧资产列表
  {
    name: 'posttabsassetManageList',
    url: 'posttabsassetManageList',
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
            assetName: 'assetName1',
            ip: 'ip1',
            mac: 'mac1',
            assetType: 'assetType1',
            assetDistrict: 'assetDistrict1',
            isFall: 'isFall1',
            assetWorth: 'assetWorth1',
            assetNature: 'assetNature1',
            assetStatus: 'assetStatus1',
            ifDataAsset: 'ifDataAsset1',
            isConnect: 'isConnect1',
            dataAssetType: 'dataAssetType1',
            dataAssetLevel: 'dataAssetLevel1',
            url: 'url1',
            assetUser: 'assetUser1',
            assetPosition: 'assetPosition1',
            safeLevel: 'safeLevel1',
            createTime: 'createTime1',
            updateTime: 'updateTime1'
          },
          {
            id: 'id2',
            assetName: 'assetName2',
            ip: 'ip2',
            mac: 'mac2',
            assetType: 'assetType2',
            assetDistrict: 'assetDistrict2',
            isFall: 'isFall2',
            assetWorth: 'assetWorth2',
            assetNature: 'assetNature2',
            assetStatus: 'assetStatus2',
            ifDataAsset: 'ifDataAsset2',
            isConnect: 'isConnect2',
            dataAssetType: 'dataAssetType2',
            dataAssetLevel: 'dataAssetLevel2',
            url: 'url2',
            assetUser: 'assetUser2',
            assetPosition: 'assetPosition2',
            safeLevel: 'safeLevel2',
            createTime: 'createTime2',
            updateTime: 'updateTime2'
          },
          {
            id: 'id3',
            assetName: 'assetName3',
            ip: 'ip3',
            mac: 'mac3',
            assetType: 'assetType3',
            assetDistrict: 'assetDistrict3',
            isFall: 'isFall3',
            assetWorth: 'assetWorth3',
            assetNature: 'assetNature3',
            assetStatus: 'assetStatus3',
            ifDataAsset: 'ifDataAsset3',
            isConnect: 'isConnect3',
            dataAssetType: 'dataAssetType3',
            dataAssetLevel: 'dataAssetLevel3',
            url: 'url3',
            assetUser: 'assetUser3',
            assetPosition: 'assetPosition3',
            safeLevel: 'safeLevel3',
            createTime: 'createTime3',
            updateTime: 'updateTime3'
          },
          {
            id: 'id4',
            assetName: 'assetName4',
            ip: 'ip4',
            mac: 'mac4',
            assetType: 'assetType4',
            assetDistrict: 'assetDistrict4',
            isFall: 'isFall4',
            assetWorth: 'assetWorth4',
            assetNature: 'assetNature4',
            assetStatus: 'assetStatus4',
            ifDataAsset: 'ifDataAsset4',
            isConnect: 'isConnect4',
            dataAssetType: 'dataAssetType4',
            dataAssetLevel: 'dataAssetLevel4',
            url: 'url4',
            assetUser: 'assetUser4',
            assetPosition: 'assetPosition4',
            safeLevel: 'safeLevel4',
            createTime: 'createTime4',
            updateTime: 'updateTime4'
          }
        ]
      }
    }
  }
]
