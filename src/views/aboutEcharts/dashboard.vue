<template>
  <div class="dashboard-page">
    <!-- 1.最上层固定内容 -->
    <div class="first-fixed">
      <div class="fixed-over-left">
        <div class="over-left-labelOne">Salaxy已安全守护您的资产</div>
        <div class="install-time-chart">
          <installTimeChart ref="installTimeChartRef"></installTimeChart>
        </div>
        <div class="over-left-labelTwo">天</div>
      </div>
      <div class="fixed-over-right">
        <div class="version-info">
          平台版本：{{ platformInfo.version || '--' }}
        </div>
        <div class="expire-info">
          <div>有效期至：{{ platformInfo.expDate || '--' }}</div>
          <div v-if="platformInfo.Exp === 1" class="expire-info-img">
            即将到期
          </div>
          <div v-if="platformInfo.Exp === 2" class="expired-info-img">
            已到期
          </div>
        </div>
      </div>
      <div class="fiexed-over-pos"></div>
      <div class="fiexed-pos"></div>
    </div>
    <!-- 2.时间查询内容 -->
    <div class="second-fixed">
      <div class="empty"></div>
      <div class="time-box">
        <div
          class="box-select"
          :class="{ isActive: currentIndex === 0 }"
          @click="timeChange(0)"
        >
          近7天
        </div>
        <div
          class="box-select"
          :class="{ isActive: currentIndex === 1 }"
          @click="timeChange(1)"
        >
          近30天
        </div>
      </div>
    </div>
    <!-- 3.仪表盘 -->
    <div class="allStat" :class="{ bigScreen: overResize }">
      <!-- 3.1 第一层统计 -->
      <div class="first-statistic commonStat">
        <div class="card-common longTwo">
          <div class="common-header">
            <div class="header-left" title="资产统计">资产统计</div>
          </div>
          <div class="common-main main-assetDetail">
            <div class="monitor-all-box">
              <div class="box-totalCount">
                <div class="totalCount-label">监测终端数</div>
                <div
                  class="totalCount-value"
                  :title="assetStatistic.agentCount | numFilter"
                >
                  {{ assetStatistic.agentCount | numFilter }}
                </div>
              </div>
              <div class="box-totalStatus">
                <div class="totalStatus-row">
                  <div class="row-rect online"></div>
                  <div class="row-label">在线</div>
                  <div
                    class="row-value"
                    :title="assetStatistic.onlineCount | numFilter"
                  >
                    {{ assetStatistic.onlineCount | numFilter }}
                  </div>
                </div>
                <div class="totalStatus-row">
                  <div class="row-rect unline"></div>
                  <div class="row-label">离线</div>
                  <div
                    class="row-value"
                    :title="assetStatistic.offCount | numFilter"
                  >
                    {{ assetStatistic.offCount | numFilter }}
                  </div>
                </div>
                <div class="totalStatus-row">
                  <div class="row-rect exline"></div>
                  <div class="row-label">过期</div>
                  <div
                    class="row-value"
                    :title="assetStatistic.expCount | numFilter"
                  >
                    {{ assetStatistic.expCount | numFilter }}
                  </div>
                </div>
              </div>
            </div>
            <div class="monitor-type-box">
              <div class="box-header">监控设备类型</div>
              <div class="box-main">
                <div
                  v-for="(item, index) in minitorAssetType"
                  :key="index"
                  class="main-card"
                >
                  <div class="card-label">
                    <div class="label-text" :title="item.label">
                      {{ item.label }}
                    </div>
                  </div>
                  <div class="card-value">
                    <div class="value-text" :title="item.value | numFilter">
                      {{ item.value | numFilter }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="告警统计">告警统计</div>
          </div>
          <div class="common-main main-alarmStatistic">
            <div class="alarmStatistic-header">
              <div class="header-row">
                <div class="row-label">总告警数</div>
                <div
                  class="row-value"
                  :title="alarmStatistic.total | numFilter"
                >
                  {{ alarmStatistic.total | numFilter }}
                </div>
              </div>
              <div class="header-img"></div>
            </div>
            <div class="alarmStatistic-content">
              <div class="content-alarmStyle">
                <alarmStatChart
                  ref="alarmHighRef"
                  id="alarmHigh"
                ></alarmStatChart>
                <div class="alarm-remark">
                  <span class="remark-label high">高危</span
                  ><span class="remark-value"
                    >{{ alarmStatistic.highPercent | numFilter }}%</span
                  >
                </div>
              </div>
              <div class="content-alarmStyle">
                <alarmStatChart
                  ref="alarmMiddleRef"
                  id="alarmMiddle"
                ></alarmStatChart>
                <div class="alarm-remark">
                  <span class="remark-label middle">中危</span
                  ><span class="remark-value"
                    >{{ alarmStatistic.middlePercent | numFilter }}%</span
                  >
                </div>
              </div>
              <div class="content-alarmStyle">
                <alarmStatChart
                  ref="alarmLowRef"
                  id="alarmLow"
                ></alarmStatChart>
                <div class="alarm-remark">
                  <span class="remark-label low">低危</span
                  ><span class="remark-value"
                    >{{ alarmStatistic.lowPercent | numFilter }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 3.2 第二层统计 -->
      <div class="second-statistic commonStat">
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="高危告警事件类型排行TOP5">
              高危告警事件类型排行TOP5
            </div>
          </div>
          <div class="common-main alarmEventType">
            <alarmEventType
              ref="alarmEventTypeRef"
              id="alarmEventTypeId"
            ></alarmEventType>
          </div>
        </div>
        <div class="card-common longTwo">
          <div class="common-header">
            <div class="header-left" title="高危告警发生趋势">
              高危告警发生趋势
            </div>
          </div>
          <div class="common-main alarmEventTrend">
            <div class="trend-header">
              <div
                v-for="(item, index) in alarmTrendCards"
                :key="index"
                class="header-card"
              >
                <div class="card-left">
                  <img
                    :src="require(`@/assets/img/aboutEcharts/${item.src}.png`)"
                  />
                </div>
                <div class="card-right">
                  <div class="right-label">
                    <div class="label-text" :title="item.label">
                      {{ item.label }}
                    </div>
                  </div>
                  <div class="right-value">
                    <div class="value-text" :title="item.value | numFilter">
                      {{ item.value | numFilter }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trend-chart">
              <alarmTrendChart
                ref="alarmTrendChartRef"
                id="alarmTrendChartId"
              ></alarmTrendChart>
            </div>
          </div>
        </div>
      </div>
      <!-- 3.3 第三层统计 -->
      <div class="third-statistic commonStat">
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="高风险资产排行TOP5">
              高风险资产排行TOP5
            </div>
          </div>
          <div class="common-main highRiskAsset">
            <highRiskAssetChart
              ref="highRiskAssetChartRef"
              id="highRiskAssetChartId"
            ></highRiskAssetChart>
          </div>
        </div>
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="账号风险类型占比">
              账号风险类型占比
            </div>
          </div>
          <div class="common-main accountRiskType">
            <accountRiskTypeChart
              ref="accountRiskTypeChartRef"
              id="accountRiskTypeChartId"
            ></accountRiskTypeChart>
            <div
              v-if="accountRiskType.length !== 0"
              class="accountRiskType-img"
            ></div>
          </div>
        </div>
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="脆弱性资产分析排行TOP5">
              脆弱性资产分析排行TOP5
            </div>
          </div>
          <div class="common-main fragilityAsset">
            <fragilityAssetChart
              ref="fragilityAssetChartRef"
            ></fragilityAssetChart>
          </div>
        </div>
      </div>
      <!-- 3.4 第四层统计 -->
      <div class="fourth-statistic commonStat">
        <div class="card-common">
          <div class="common-header">
            <div
              class="header-left spec-appThreat"
              title="应用软件威胁排行TOP5"
            >
              应用软件威胁排行TOP5
            </div>
            <div class="header-right">
              <div class="tabs">
                <div
                  class="tabs-common"
                  :class="{ isActive: appIndex === 0 }"
                  @click="appBtns(0)"
                >
                  风险应用
                </div>
                <div
                  class="tabs-common"
                  :class="{ isActive: appIndex === 1 }"
                  @click="appBtns(1)"
                >
                  封控拦截
                </div>
              </div>
            </div>
          </div>
          <div class="common-main appThreaten">
            <appThreatenChart
              ref="appThreatenChartRef"
              id="appThreatenChartId"
            ></appThreatenChart>
          </div>
        </div>
        <div class="card-common longTwo">
          <div class="common-header">
            <div class="header-left" title="基线核查">基线核查</div>
          </div>
          <div class="common-main baselineExam">
            <div class="base-common base-statistic">
              <div class="box-common statistic-task">
                <div class="left">
                  <div class="left-value">
                    <div
                      class="value"
                      :title="baselineExam.taskCount | numFilter"
                    >
                      {{ baselineExam.taskCount | numFilter }}
                    </div>
                  </div>
                  <div class="left-label">基线任务数</div>
                </div>
                <div class="right task"></div>
              </div>
              <div class="box-common statistic-taskAll">
                <div class="left">
                  <div class="left-value">
                    <div
                      class="value"
                      :title="baselineExam.recordCount | numFilter"
                    >
                      {{ baselineExam.recordCount | numFilter }}
                    </div>
                  </div>
                  <div class="left-label">任务执行总数</div>
                </div>
                <div class="right taskAll"></div>
              </div>
              <div class="box-common statistic-asset">
                <div class="left">
                  <div class="left-value">
                    <div
                      class="value"
                      :title="baselineExam.riskAgent | numFilter"
                    >
                      {{ baselineExam.riskAgent | numFilter }}
                    </div>
                  </div>
                  <div class="left-label">存在风险资产数</div>
                </div>
                <div class="right asset"></div>
              </div>
            </div>
            <div class="base-common base-taskType">
              <div class="taskType-header">任务类型占比</div>
              <div class="taskType-chart">
                <taskTypePercentChart
                  ref="taskTypePercentChartRef"
                  id="taskTypePercentChartId"
                ></taskTypePercentChart>
              </div>
            </div>
            <div class="base-common base-riskAsset">
              <div class="riskAsset-header">风险资产排行TOP5</div>
              <div class="riskAsset-chart">
                <riskAssetChart
                  ref="riskAssetChartRef"
                  id="riskAssetChartId"
                ></riskAssetChart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 3.4 第五层统计 -->
      <div class="fifth-statistic commonStat">
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="软件风控分布指标">
              软件封控分布指标
            </div>
          </div>
          <div class="common-main soapContain">
            <soapContainChart
              ref="soapContainChartRef"
              id="soapContainChartId"
            ></soapContainChart>
          </div>
        </div>
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="数据库分布指标">数据库分布指标</div>
          </div>
          <div class="common-main databaseContain">
            <databaseContainChart
              ref="databaseContainChartRef"
              id="databaseContainChart"
            ></databaseContainChart>
          </div>
        </div>
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="报告类型雷达">报告类型雷达</div>
          </div>
          <div class="common-main reportTypeRadar">
            <reportTypeRadarChart
              ref="reportTypeRadarChartRef"
              id="reportTypeRadarChartId"
            ></reportTypeRadarChart>
          </div>
        </div>
      </div>
      <!-- 3.4 第六层统计 -->
      <div class="sixth-statistic commonStat">
        <div class="card-common">
          <div class="common-header">
            <div class="header-left" title="高危资产占比">高危资产占比</div>
          </div>
          <div class="common-main dangerAssetRate">
            <highRiskPrecentChart
              ref="highRiskPrecentChartRef"
              id="highRiskPrecentChartId"
            ></highRiskPrecentChart>
          </div>
        </div>
        <div class="card-common longTwo">
          <div class="common-header">
            <div class="header-left" title="流量统计">流量统计</div>
          </div>
          <div class="common-main flowStatistic">
            <flowStatisticChart
              ref="flowStatisticChartRef"
              id="flowStatisticChartId"
            ></flowStatisticChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import installTimeChart from '@/views/aboutEcharts/dashboard/installTimeChart'
import alarmStatChart from '@/views/aboutEcharts/dashboard/alarmStatChart'
import alarmEventType from '@/views/aboutEcharts/dashboard/alarmEventType'
import alarmTrendChart from '@/views/aboutEcharts/dashboard/alarmTrendChart'
import accountRiskTypeChart from '@/views/aboutEcharts/dashboard/accountRiskTypeChart'
import fragilityAssetChart from '@/views/aboutEcharts/dashboard/fragilityAssetChart'
import appThreatenChart from '@/views/aboutEcharts/dashboard/appThreatenChart'
import taskTypePercentChart from '@/views/aboutEcharts/dashboard/taskTypePercentChart'
import riskAssetChart from '@/views/aboutEcharts/dashboard/riskAssetChart'
import highRiskAssetChart from '@/views/aboutEcharts/dashboard/highRiskAssetChart'
import soapContainChart from '@/views/aboutEcharts/dashboard/soapContainChart'
import databaseContainChart from '@/views/aboutEcharts/dashboard/databaseContainChart.vue'
import reportTypeRadarChart from '@/views/aboutEcharts/dashboard/reportTypeRadarChart.vue'
import flowStatisticChart from '@/views/aboutEcharts/dashboard/flowStatisticChart.vue'
import highRiskPrecentChart from '@/views/aboutEcharts/dashboard/highRiskPrecentChart.vue'
import allDict from '@/utils/dict'
import {
  getInstallInfoPort,
  getAllChartInfoPort
} from '@/api/request/aboutEcharts'

export default {
  name: 'dashboard',
  components: {
    installTimeChart,
    alarmStatChart,
    alarmEventType,
    alarmTrendChart,
    accountRiskTypeChart,
    fragilityAssetChart,
    appThreatenChart,
    taskTypePercentChart,
    riskAssetChart,
    highRiskAssetChart,
    soapContainChart,
    databaseContainChart,
    reportTypeRadarChart,
    flowStatisticChart,
    highRiskPrecentChart
  },
  data() {
    return {
      overResize: false,
      allInfo: {},
      haveData: false,
      platformInfo: {},
      currentIndex: 0,
      assetStatistic: {},
      minitorAssetType: [
        {
          key: 'win-pc',
          label: 'win-pc'
        },
        {
          key: 'win-server',
          label: 'win-server'
        },
        {
          key: 'linux',
          label: 'linux'
        },
        {
          key: 'other',
          label: '其他'
        }
      ],
      alarmStatistic: {},
      alarmHighStatistic: {},
      alarmMiddleStatistic: {},
      alarmLowStatistic: {},
      alarmEventType: [],
      alarmEventTrend: {},
      alarmTrendCards: [
        {
          key: 'file',
          label: '文件',
          src: 'icon_wenjian'
        },
        {
          key: 'process',
          label: '进程',
          src: 'icon_jincheng'
        },
        {
          key: 'autoStart',
          label: '自启项',
          src: 'icon_ziqixiang'
        },
        {
          key: 'log',
          label: '日志',
          src: 'icon_rizhi'
        },
        {
          key: 'monitor',
          label: '监控',
          src: 'icon_jiankong'
        }
      ],
      alarmTrendInfo: [],
      highRiskAsset: [],
      accountRiskType: [],
      fragilityAsset: [],
      appIndex: 0,
      appThreaten: {},
      baselineExam: {},
      baselineTaskType: {},
      baselineRiskAsset: [],
      soapContainInfo: [],
      databaseContainInfo: [],
      reportTypeRadarInfo: [],
      flowStatisticInfo: [],
      highRiskPrecentInfo: 0,
      riskTypeList: allDict.riskType,
      update: 0
    }
  },
  filters: {
    numFilter(res) {
      let result = '--'
      if (res || res === 0) {
        result = parseInt(res).toLocaleString()
      }
      return result
    }
  },
  watch: {
    overResize: {
      deep: true,
      handler() {
        this.resizeJump()
      }
    }
  },
  activated() {
    if (this.update === 0) {
      this.update += 1
    } else {
      this.getInstallInfo()
      this.getAllChartInfo(true)
    }
  },
  mounted() {
    this.screenResize()
    window.addEventListener('resize', this.screenResize)
    this.getInstallInfo()
    this.getAllChartInfo()
  },
  methods: {
    screenResize() {
      const allStatDom = document.querySelector('.allStat')
      if (allStatDom && allStatDom.clientHeight > 1196) {
        this.overResize = true
      } else {
        this.overResize = false
      }
    },
    resizeJump() {
      if (this.haveData) {
        this.rendererCharts(true)
      }
    },
    async getInstallInfo() {
      const res = await getInstallInfoPort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list[0] || {}
        this.platformInfo = info
        const installTime = parseInt(this.platformInfo.runDate || 0)
        this.$refs.installTimeChartRef.initCharts(installTime)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    async getAllChartInfo(isCache) {
      const params = {
        range: this.currentIndex === 0 ? 1 : 2
      }
      const res = await getAllChartInfoPort(params)
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list[0] || {}
        this.allInfo = info
        this.rendererCharts(isCache)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    rendererCharts(isCache) {
      // 资产统计
      this.assetStatistic = this.allInfo.assetStatistic || {}
      this.minitorAssetType.map((item) => {
        const obj =
          this.assetStatistic.agentType.find(
            (smitem) => item.key === smitem.type
          ) || {}
        item.value = obj.count
        return { ...item }
      })
      // 告警统计
      this.alarmStatistic = this.allInfo.alarmLevel
      if (!this.alarmStatistic.high) {
        this.alarmStatistic.highPercent = 0
      } else {
        this.alarmStatistic.highPercent = (
          (this.alarmStatistic.high / this.alarmStatistic.total) *
          100
        ).toFixed(0)
      }
      if (!this.alarmStatistic.middle) {
        this.alarmStatistic.middlePercent = 0
      } else {
        this.alarmStatistic.middlePercent = (
          (this.alarmStatistic.middle / this.alarmStatistic.total) *
          100
        ).toFixed(0)
      }
      if (!this.alarmStatistic.low) {
        this.alarmStatistic.lowPercent = 0
      } else {
        this.alarmStatistic.lowPercent =
          100 -
          this.alarmStatistic.highPercent -
          this.alarmStatistic.middlePercent +
          ''
      }
      this.alarmHighStatistic = {
        color: '#ff7b74',
        count: this.alarmStatistic.high || 0,
        total: this.alarmStatistic.total || 0
      }
      this.alarmMidlleStatistic = {
        color: '#FFAD44',
        count: this.alarmStatistic.middle || 0,
        total: this.alarmStatistic.total || 0
      }
      this.alarmLowStatistic = {
        color: '#79ADFF',
        count: this.alarmStatistic.low || 0,
        total: this.alarmStatistic.total || 0
      }
      this.$refs.alarmHighRef.initCharts(this.alarmHighStatistic)
      this.$refs.alarmMiddleRef.initCharts(this.alarmMidlleStatistic)
      this.$refs.alarmLowRef.initCharts(this.alarmLowStatistic)
      // 告警事件类型排行
      this.alarmEventType = this.allInfo.alarmTags || []
      this.$refs.alarmEventTypeRef.initCharts(this.alarmEventType)
      // 高危告警发生趋势
      this.alarmEventTrend = this.allInfo.alarmEventTrend || {}
      this.alarmTrendCards.map((item) => {
        item.value = this.alarmEventTrend[item.key]
        return { ...item }
      })
      this.alarmTrendInfo = this.alarmEventTrend.alarmCurrent || []
      this.$refs.alarmTrendChartRef.initCharts(this.alarmTrendInfo)
      // 高风险资产排行
      const highRiskAsset = this.allInfo.alarmOverviewInGroup || []
      this.highRiskAsset = highRiskAsset.map((item) => {
        return { agents: item.agents, name: item.group, value: item.count }
      })
      this.$refs.highRiskAssetChartRef.initCharts(this.highRiskAsset, isCache)
      // 账号风险类型占比
      const accountRiskType = this.allInfo.userRisk || []
      this.accountRiskType = accountRiskType.map((item) => {
        const obj =
          this.riskTypeList.find((smitem) => smitem.value === item.name) || {}
        return { name: obj.label, value: item.count }
      })
      this.$refs.accountRiskTypeChartRef.initCharts(this.accountRiskType)
      // 脆弱性资产分析
      this.fragilityAsset = this.allInfo.vul || []
      this.$refs.fragilityAssetChartRef.initCharts(this.fragilityAsset)
      // 应用软件威胁排行
      this.appThreaten = this.allInfo.alarmApp || {}
      this.rendererAppChart()
      // 基线核查
      this.baselineExam = this.allInfo.baseline || {}
      const baselineTaskType = this.baselineExam.ratioClass || []
      this.baselineTaskType = baselineTaskType.map((item) => {
        return { name: item.name, value: item.count }
      })
      this.$refs.taskTypePercentChartRef.initCharts(this.baselineTaskType)
      const baselineRiskAsset = this.baselineExam.agents || []
      this.baselineRiskAsset = baselineRiskAsset.map((item) => {
        return { name: item.agentName, value: item.count }
      })
      this.$refs.riskAssetChartRef.initCharts(this.baselineRiskAsset)
      // 软件封控分布指标
      const soapContainInfo = this.allInfo.soapCont || []
      this.soapContainInfo = soapContainInfo.map((item) => {
        return { name: item.name, value: item.num }
      })
      this.$refs.soapContainChartRef.initCharts(this.soapContainInfo)
      // 数据库分布指标
      const databaseContainInfo = this.allInfo.databaseCont || []
      this.databaseContainInfo = databaseContainInfo.map((item) => {
        return { name: item.name, value: item.num }
      })
      this.$refs.databaseContainChartRef.initCharts(this.databaseContainInfo)
      // 报告类型雷达
      const reportTypeRadarInfo = this.allInfo.reportCount || []
      this.reportTypeRadarInfo = reportTypeRadarInfo.map((item) => {
        return { name: item.title, value1: item.value1, value2: item.value2 }
      })
      this.$refs.reportTypeRadarChartRef.initCharts(this.reportTypeRadarInfo)
      // 高危资产占比
      this.highRiskPrecentInfo = this.allInfo.highPrecent
      this.$refs.highRiskPrecentChartRef.initCharts(this.highRiskPrecentInfo)
      // 流量统计
      const flowStatisticInfo = this.allInfo.flowInfo || []
      this.flowStatisticInfo = flowStatisticInfo
      this.$refs.flowStatisticChartRef.initCharts(this.flowStatisticInfo)
      // 数据加载完毕
      this.$nextTick(() => {
        this.haveData = true
      })
    },
    timeChange(index) {
      this.currentIndex = index
      this.getAllChartInfo()
    },
    appBtns(index) {
      this.appIndex = index
      this.rendererAppChart()
    },
    rendererAppChart() {
      if (this.appIndex === 0) {
        this.$refs.appThreatenChartRef.initCharts(
          this.appThreaten.riskAppList || []
        )
      } else {
        this.$refs.appThreatenChartRef.initCharts(
          this.appThreaten.appAlarmList || []
        )
      }
    }
  }
}
</script>

<style lang="less">
.dashboard-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  .first-fixed {
    position: relative;
    width: 100%;
    height: 146px;
    background: url('~@/assets/img/aboutEcharts/time-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    .fixed-over-left {
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 33px;
      .over-left-labelOne,
      .over-left-labelTwo {
        font-size: 20px;
        font-family: 'Alibaba-PuHuiTi-Medium';
        color: #68befe;
      }
      .install-time-chart {
        margin: 0 10px;
      }
    }
    .fixed-over-right {
      margin: 0 6%;
      color: #68befe;
      line-height: 20px;
      z-index: 9;
      .expire-info {
        margin-top: 4px;
        display: flex;
        .expire-info-img {
          padding: 0 9px;
          background-color: rgba(0, 0, 0, 0.3);
          color: #d66966;
          border: 1px solid #d66966;
          margin-left: 6px;
          border-radius: 4px;
        }
        .expired-info-img {
          padding: 0 9px;
          background-color: rgba(0, 0, 0, 0.3);
          color: #909398;
          border: 1px solid #909398;
          margin-left: 6px;
          border-radius: 4px;
        }
      }
    }
    .fiexed-over-pos {
      position: absolute;
      top: 0;
      right: 0;
      width: 68px;
      height: 24px;
      background: url('~@/assets/img/aboutEcharts/tag_profession.png') no-repeat;
      background-size: 100% 100%;
    }
    .fiexed-pos {
      position: absolute;
      top: 0;
      right: 0;
      width: 360px;
      height: 146px;
      background: url('~@/assets/img/aboutEcharts/time-pos.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .second-fixed {
    width: 100%;
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time-box {
      display: flex;
      align-items: center;
      .box-select {
        padding: 0 10px;
        cursor: pointer;
        color: #2d2f33;
        &:first-child {
          border-right: 1px solid #dcdfe6;
        }
        &.isActive {
          color: #2985f7;
        }
        &:hover {
          opacity: 0.85;
        }
      }
    }
  }
  .allStat {
    width: 100%;
    height: calc(100% - 146px - 34px);
    overflow: auto;
    &.bigScreen {
      .commonStat {
        height: calc((100% - 36px) / 4);
        .card-common {
          height: 100%;
          .main-assetDetail {
            .monitor-all-box {
              width: 17%;
              height: calc(100% - 20px);
            }
            .monitor-type-box {
              width: calc(83% - 38px);
            }
          }
        }
      }
    }
    .commonStat {
      display: flex;
      justify-content: space-between;
    }
    .card-common {
      width: calc((100% - 24px) / 3);
      height: 290px;
      background-color: #fff;
      border-radius: 4px;
      &.longTwo {
        width: calc((200% - 12px) / 3);
      }
      .common-header {
        width: calc(100% - 40px);
        height: 56px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
          font-size: 20px;
          font-family: 'Alibaba-PuHuiTi-Medium';
          color: #0e1011;
          &.spec-appThreat {
            max-width: calc(100% - 162px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .header-right {
          .right-btns {
            color: #2985f7;
            cursor: pointer;
            &:hover {
              opacity: 0.85;
            }
          }
        }
      }
      .common-main {
        width: calc(100% - 40px);
        height: calc(100% - 56px);
        padding: 0 20px;
      }
    }
    .first-statistic {
      .main-assetDetail {
        display: flex;
        justify-content: space-between;
        .monitor-all-box {
          position: relative;
          width: 250px;
          height: 214px;
          background: url('~@/assets/img/aboutEcharts/img_total_bg.png')
            no-repeat;
          background-size: 100% 100%;
          .box-totalCount {
            position: absolute;
            top: 18px;
            left: 11px;
            max-width: calc(100% - 22px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .totalCount-label {
              color: #878d99;
              line-height: 20px;
            }
            .totalCount-value {
              font-size: 32px;
              font-family: 'DIN-Alternate-Bold';
              color: #0e1011;
              line-height: 32px;
              margin-top: 6px;
            }
          }
          .box-totalStatus {
            position: absolute;
            bottom: 8px;
            left: 11px;
            width: calc(100% - 22px);
            .totalStatus-row {
              display: flex;
              align-items: center;
              margin-top: 12px;
              width: 100%;
              .row-rect {
                width: 8px;
                height: 8px;
                background: #51cd84;
                border-radius: 50%;
                &.online {
                  background-color: #51cd84;
                }
                &.unline {
                  background-color: #a0b0ca;
                }
                &.exline {
                  background-color: #ffad44;
                }
              }
              .row-label {
                color: #2d2f33;
                line-height: 20px;
                margin-left: 6px;
              }
              .row-value {
                max-width: calc(100% - 48px);
                font-size: 18px;
                font-family: 'DIN-Alternate-Bold';
                color: #0e1011;
                line-height: 20px;
                margin-left: 6px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        .monitor-type-box {
          width: calc(100% - 250px - 38px);
          height: calc(100% - 20px);
          .box-header {
            font-family: 'Alibaba-PuHuiTi-Medium';
            color: #333333;
            line-height: 18px;
          }
          .box-main {
            display: flex;
            justify-content: space-between;
            align-content: space-between;
            flex-wrap: wrap;
            margin-top: 8px;
            width: 100%;
            height: calc(100% - 26px);
            .main-card {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: calc((100% - 39px) / 4);
              height: calc((100% - 13px) / 2);
              background: url('~@/assets/img/aboutEcharts/img_shebei_bg.png')
                no-repeat;
              background-size: 100% 100%;
              .card-label {
                display: flex;
                justify-content: center;
                color: #878d99;
                line-height: 22px;
                .label-text {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .card-value {
                display: flex;
                justify-content: center;
                margin-top: 1px;
                text-align: center;
                font-size: 22px;
                font-family: 'DIN-Alternate-Bold';
                color: #0e1011;
                line-height: 24px;
                .value-text {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }
      .main-alarmStatistic {
        .alarmStatistic-header {
          position: relative;
          width: 100%;
          height: 60px;
          background-color: #fff5f5;
          border-radius: 6px;
          .header-row {
            display: flex;
            align-items: center;
            line-height: 60px;
            .row-label {
              margin-left: 22px;
              color: #878d99;
            }
            .row-value {
              max-width: calc(100% - 112px);
              margin-left: 12px;
              font-size: 32px;
              font-family: 'DIN-Alternate-Bold';
              color: #0e1011;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              z-index: 9;
            }
          }
          .header-img {
            position: absolute;
            top: 0;
            right: 0;
            width: 110px;
            height: 60px;
            background: url('~@/assets/img/aboutEcharts/img_gaojing_bg.png')
              no-repeat;
            background-size: 100% 100%;
          }
        }
        .alarmStatistic-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: #ffa3a3;
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }
        .alarmStatistic-content {
          width: 100%;
          height: calc(100% - 80px);
          display: flex;
          justify-content: space-between;
          .content-alarmStyle {
            width: calc(100% / 3);
            .alarm-remark {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: -22px;
              .remark-label {
                display: inline-block;
                font-size: 12px;
                padding: 0 7px;
                background: #ff7b74;
                border-radius: 4px;
                color: #ffffff;
                line-height: 22px;
                &.high {
                  background-color: #ff7b74;
                }
                &.middle {
                  background-color: #ffad44;
                }
                &.low {
                  background-color: #79adff;
                }
              }
              .remark-value {
                font-size: 18px;
                color: #333333;
                line-height: 22px;
                text-shadow: 0px 2px 0px 0px rgba(255, 255, 255, 0.15);
                margin-left: 4px;
              }
            }
          }
        }
      }
    }
    .second-statistic {
      margin-top: 12px;
      .alarmEventType {
        height: calc(100% - 56px - 20px);
      }
      .alarmEventTrend {
        height: calc(100% - 56px - 20px);
        .trend-header {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 60px;
          .header-card {
            display: flex;
            align-items: center;
            width: calc((100% - 48px) / 5);
            height: 100%;
            background-color: #f1f7ff;
            border-radius: 6px;
            .card-left {
              width: 58px;
              height: 58px;
              margin-left: 10px;
              margin-top: 3px;
            }
            .card-right {
              max-width: calc(100% - 88px);
              margin-left: 7px;
              .right-label {
                display: flex;
                color: #878d99;
                .label-text {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .right-value {
                display: flex;
                font-family: 'DIN-Alternate-Bold';
                color: #0e1011;
                font-size: 18px;
                margin-top: 2px;
                .value-text {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
        .trend-chart {
          width: 100%;
          height: calc(100% - 75px);
          margin-top: 15px;
        }
      }
    }
    .third-statistic {
      margin-top: 12px;
      .highRiskAsset {
        height: calc(100% - 56px - 20px);
      }
      .accountRiskType {
        position: relative;
        height: calc(100% - 56px - 20px);
        .accountRiskType-img {
          position: absolute;
          top: 50%;
          left: 37%;
          transform: translate(-37%, -50%);
          width: 40px;
          height: 40px;
          background: url('~@/assets/img/aboutEcharts/icon_fengxian.png')
            no-repeat;
          background-size: 100% 100%;
        }
      }
      .fragilityAsset {
        height: calc(100% - 56px - 20px);
      }
    }
    .fourth-statistic {
      margin-top: 12px;
      .common-header .tabs {
        display: flex;
        align-items: center;
        cursor: pointer;
        .tabs-common {
          color: #2985f7;
          border: 1px solid #2985f7;
          border-left: none;
          padding: 3px 12px;
          overflow: hidden;
          border-radius: 0px 2px 2px 0px;
          &:first-child {
            border-left: 1px solid #2985f7;
            border-radius: 2px 0px 0px 2px;
          }
          &:hover {
            opacity: 0.85;
          }
          &.isActive {
            background-color: #2985f7;
            color: #fff;
          }
        }
      }
      .appThreaten {
        height: calc(100% - 56px - 20px);
      }
      .baselineExam {
        display: flex;
        justify-content: space-between;
        height: calc(100% - 56px - 20px);
        .base-common {
          width: calc((100% - 40px) / 3);
          height: 100%;
          &.base-statistic {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .box-common {
              display: flex;
              align-items: center;
              .left {
                max-width: calc(100% - 44px);
                margin-left: 22px;
                .left-value {
                  display: flex;
                  line-height: 28px;
                  .value {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    z-index: 9;
                    font-size: 24px;
                    font-family: 'DIN-Alternate-Bold';
                    color: #0e1011;
                  }
                }
                .left-label {
                  font-size: 12px;
                  color: #878d99;
                  line-height: 16px;
                }
              }
              .right {
                position: absolute;
                top: 0;
                right: 0;
                width: 110px;
                height: 60px;
                background: url('~@/assets/img/aboutEcharts/img_renwu_bg.png')
                  no-repeat;
                background-size: 100% 100%;
                &.task {
                  background: url('~@/assets/img/aboutEcharts/img_renwu_bg.png')
                    no-repeat;
                  background-size: 100% 100%;
                }
                &.taskAll {
                  background: url('~@/assets/img/aboutEcharts/img_zhixing_bg.png')
                    no-repeat;
                  background-size: 100% 100%;
                }
                &.asset {
                  background: url('~@/assets/img/aboutEcharts/img_zichan_bg.png')
                    no-repeat;
                  background-size: 100% 100%;
                }
              }
            }
            .statistic-task {
              position: relative;
              width: 100%;
              height: 60px;
              border-radius: 6px;
              background-color: #e9f3ff;
            }
            .statistic-task::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background-color: #a9d0ff;
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
            }
            .statistic-taskAll {
              position: relative;
              width: 100%;
              height: 60px;
              border-radius: 6px;
              background-color: #ebefff;
            }
            .statistic-taskAll::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background-color: #a3b6ff;
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
            }
            .statistic-asset {
              position: relative;
              width: 100%;
              height: 60px;
              border-radius: 6px;
              background-color: #fff5f5;
            }
            .statistic-asset::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background-color: #ffa3a3;
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
            }
          }
          &.base-taskType {
            .taskType-header {
              height: 18px;
              font-family: 'Alibaba-PuHuiTi-Medium';
              color: #333333;
              line-height: 18px;
            }
            .taskType-chart {
              width: 100%;
              height: calc(100% - 18px);
            }
          }
          &.base-riskAsset {
            .riskAsset-header {
              height: 18px;
              font-family: 'Alibaba-PuHuiTi-Medium';
              color: #333333;
              line-height: 18px;
            }
            .riskAsset-chart {
              margin-top: 8px;
              width: 100%;
              height: calc(100% - 26px);
            }
          }
        }
      }
    }
    .fifth-statistic {
      margin-top: 12px;
      .soapContain,
      .databaseContain,
      .reportTypeRadar {
        height: calc(100% - 56px - 20px);
      }
    }
    .sixth-statistic {
      margin-top: 12px;
      .dangerAssetRate,
      .flowStatistic {
        height: calc(100% - 56px - 20px);
      }
    }
  }
}
</style>
