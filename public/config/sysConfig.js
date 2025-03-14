const sysConfig = {
  // 是否为本地化部署【默认false】
  isLocal: true,
  // 网关接口前缀
  urlPrefix: '/api', // 统一接口前缀
  // 路由跳转时是否取消所有pending中的请求【默认为true】
  requestCancelBeforeRoute: true,
  // 接口请求超时时间【默认120，单位秒】
  timeout: 120,
  // 配置需要Mock的数据接口，以拼接的接口名作为key，若key对应的value为true则表示需要进Mock
  mockInterface: {
    isMock: true, // 是否开启Mock模式【默认false】
    isAllMock: true, // 是否开启所有接口的Mock模式【默认false】
    isJson: false, // 使用json文件作为模拟数据，解决mockjs插件影响blob返回数据的问题【默认false】
    mockDatas: {
      /** 鉴权/其他 **/
      getcaptcha: false, // 获取验证码
      postuserlogin: false, // 用户登录
      postismctoken: false, // 单点登录获取用户信息
      postuserrole: false, // 用户权限
      postuserlogout: false, // 退出登录
      /** 工作台 */
      postboardsysInfo: false, // 上方总览信息统计
      postboardoverview: false, // 下方图表信息统计
      /** Grid布局 */
      postgridallCard: false, // 所有卡片
      postgridlayout: false, // 卡片布局
      /** 系统管理 */
      postuserlist: false, // 账号管理-查询用户
      postrolelist: false, // 账号管理-查询角色
      postquestionlist: false, // 账号管理-获取安全问题
      /** 表格相关 */
      posttableblackwhitelist: false, // 基础表格-DNS黑名单列表
      posttableassetTypeDict: false, // 基础表格-资产类别获取
      posttableexecuteRangeDict: false, // 基础表格-执行范围获取
      posttableblackListInfo: false, // 基础表格-黑名单信息
      postcomplexTablehighFreqLeak: false, // 复杂表格-TOP10高频漏洞
      postcomplexTableassetFreqLeak: false, // 复杂表格-漏洞资产占比
      postcomplexTablenetSafeEvent: false, // 复杂表格-网络安全事件列表
      postcomplexTablenetSafeEventExpand: false, // 复杂表格-网络安全事件列表展开列表
      postcsearchTablealarmLog: false, // 表格聚合查询-告警日志列表
      postcsearchTablealarmMultDict: false, // 表格聚合查询-表格多选字段字典
      /** tab相关 */
      posttabsassetManageTree: false, // 页面级tab-资产管理-左侧资产树
      posttabsassetManageList: false, // 页面级tab-资产管理-右侧资产列表
      /* 不模拟的接口 */
      getdefaultport: false
    }
  }
}
window.sysConfig = sysConfig
