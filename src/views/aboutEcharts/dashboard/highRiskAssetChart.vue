<template>
  <div class="highRiskAssetChart-page">
    <div class="chart1">
      <div v-if="!nochartdatas1" class="chart1-label">
        {{ currentPieInfo.name || '--' }}
      </div>
      <chartTool
        :class="{ 'edr-nonechartdata': nochartdatas1 }"
        :id="id"
        ref="highRiskAssetChartRef"
        :option="optionData"
      ></chartTool>
    </div>
    <div class="chart2">
      <div class="bar-box highRiskBoxClass" v-if="resetContent">
        <div
          v-for="(item, index) in rankList"
          :key="index"
          class="bar-row highRiskRowClass"
        >
          <div class="top">
            <div class="top-name">
              <div class="name-label" :title="item.agentName || '--'">
                {{ item.agentName || '--' }}
              </div>
            </div>
            <div class="top-value">
              <span class="value-count" :title="item.count | numFilter">{{
                item.count | numFilter
              }}</span>
            </div>
          </div>
          <div class="content">
            <div
              class="content-active"
              :style="{ width: total ? (item.count / total) * 100 + '%' || 0 : 0 }"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="nochartdatas2"
        :class="{ 'edr-nonechartdata': rankList.length === 0 }"
        class="noDataClass"
      ></div>
    </div>
  </div>
</template>

<script>
import { numberThousand } from '@/utils/dataFunction'

export default {
  name: 'highRiskAssetChart',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nochartdatas1: true,
      nochartdatas2: true,
      resetContent: true,
      optionData: {},
      allInfo: [],
      dataIndex: 0,
      lastIndex: -1,
      hoverIndex: -1,
      currentPieInfo: {},
      rankList: [],
      total: 0,
      myChart: null
    }
  },
  filters: {
    numFilter(val) {
      let result = '--'
      if (val || val === 0) {
        result = parseInt(val).toLocaleString()
      }
      return result
    }
  },
  mounted() {
    window.addEventListener('resize', this.rowMarginTop)
  },
  methods: {
    rowMarginTop() {
      const dom1 = document.querySelector('.highRiskBoxClass')
      const dom2 = document.querySelectorAll('.highRiskRowClass')
      if (dom1 && dom2) {
        dom2.forEach((item, index) => {
          if (index > 0) {
            item.style.marginTop = (dom1.clientHeight - 150) / 4 + 'px'
          }
        })
      }
    },
    init() {
      this.nochartdatas1 = true
      this.nochartdatas2 = true
      this.resetContent = true
      this.optionData = {}
      this.allInfo = []
      this.dataIndex = 0
      this.lastIndex = -1
      this.hoverIndex = -1
      this.currentPieInfo = {}
      this.rankList = []
      this.total = 0
      this.myChart = null
    },
    initCharts(data, isCache) {
      if (!isCache) {
        this.init()
      }
      if (data && data.length > 0) {
        this.nochartdatas1 = false
        this.allInfo = data
        this.optionData = {
          tooltip: {
            show: true,
            confine: true,
            trigger: 'item',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            formatter: function (params) {
              const toolTip = `
              <div class="tool-name">
                <div class="circle" style="background-color: ${params.color}"></div>
                <div class="name-tool">${params.data.name}</div>
                <div class="name-value">
                  <span>${numberThousand(params.data.value)}</span>
                  <span class="valueLine">|</span>
                  <span>${params.percent}%</span>
                </div>
              </div>
            `
              return toolTip
            }
          },
          series: [
            {
              color: [
                '#5191ff',
                '#8994fd',
                '#5950eb',
                '#291fe1',
                '#c7e2ff',
                '#81d2e0'
              ],
              type: 'pie',
              radius: ['35%', '60%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: true,
              labelLine: {
                length: 1
              },
              label: {
                formatter: `{d}%`,
                fontFamily: 'Alibaba-PuHuiTi-Regular'
              },
              data: this.allInfo
            }
          ]
        }
        this.myChart = this.$refs.highRiskAssetChartRef.getChartInstance()
        this.$nextTick(() => {
          this.operateChart()
        })
      } else {
        this.myChart = this.$refs.highRiskAssetChartRef.getChartInstance()
        this.myChart.clear()
        this.nochartdatas1 = true
        this.nochartdatas2 = true
        this.resetContent = true
        this.allInfo = []
        this.rankList = []
      }
    },
    initBar() {
      const rankList = this.rankList
      this.rankList = new Array(rankList.length).fill({ count: 0 })
      this.resetContent = false
      this.$nextTick(() => {
        this.resetContent = true
        setTimeout(() => {
          this.rankList = rankList
          if (this.rankList.length > 0) {
            this.nochartdatas2 = false
            this.total = this.rankList[0].count
          } else {
            this.nochartdatas2 = true
            this.rankList = []
            this.total = 0
          }
          this.rowMarginTop()
        }, 30)
      })
    },
    operateChart() {
      this.defaultPieChart()
      this.myChart.on('mouseover', (parmas) => {
        this.hoverIndex = parmas.dataIndex
        if (parmas.dataIndex !== this.dataIndex) {
          this.currentPieInfo = this.allInfo[parmas.dataIndex] || {}
          this.rankList = this.currentPieInfo.agents || []
          this.initBar()
        }
      })
      this.myChart.on('mouseout', (parmas) => {
        if (parmas.dataIndex !== this.dataIndex) {
          this.currentPieInfo = this.allInfo[this.dataIndex] || {}
          this.rankList = this.currentPieInfo.agents || []
          this.initBar()
        }
      })
      this.myChart.on('click', (parmas) => {
        this.dataIndex = parmas.dataIndex
        this.defaultPieChart()
      })
    },
    defaultPieChart() {
      this.currentPieInfo = this.allInfo[this.dataIndex] || {}
      this.rankList = this.currentPieInfo.agents || []
      this.optionData.series[0].data.forEach((item, index) => {
        if (index === this.dataIndex) {
          item.itemStyle = {
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowBlur: 20
          }
        } else {
          item.itemStyle = {}
        }
      })
      this.myChart.setOption(this.optionData)
      this.myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.lastIndex
      })
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.dataIndex
      })
      this.lastIndex = this.dataIndex
      if (this.dataIndex !== this.hoverIndex) {
        this.initBar()
      }
    }
  }
}
</script>

<style lang="less">
.highRiskAssetChart-page {
  width: 100%;
  height: 100%;
  display: flex;
  .chart1 {
    width: 63%;
    height: 100%;
    .chart1-label {
      font-family: 'Alibaba-PuHuiTi-Medium';
      color: #333333;
    }
    .tool-name {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid #d9dfea;
      border-radius: 2px;
      box-shadow: 0px 4px 12px 0px rgba(14, 41, 109, 0.1);
      font-family: 'Alibaba-PuHuiTi-Regular';
      padding: 5px 10px;
      .circle {
        width: 8px;
        height: 8px;
        background: #2985f7;
        border-radius: 50%;
      }
      .name-tool {
        margin-left: 8px;
        margin-right: 20px;
      }
      .name-value {
        font-family: 'Alibaba-PuHuiTi-Medium';
        .valueLine {
          vertical-align: text-bottom;
        }
      }
    }
  }
  .chart2 {
    position: relative;
    width: 37%;
    height: 100%;
    .bar-box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .bar-row {
        width: 100%;
        height: 30px;
        margin-top: calc((214px - 150px) / 4);
        &:first-child {
          margin-top: 0;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .top-name {
            max-width: calc(75% - 10px);
            color: #2d2f33;
            line-height: 18px;
            .name-label {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .top-value {
            max-width: 25%;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .value-count {
              font-size: 16px;
              font-family: 'DIN-Alternate-Bold';
              color: #2d2f33;
            }
          }
        }
        .content {
          width: 100%;
          height: 8px;
          background: #e5effa;
          border-radius: 4px;
          overflow: hidden;
          .content-active {
            width: 0;
            height: 100%;
            background: linear-gradient(270deg, #5191ff 1%, #81d2e0);
            transition: width 1s;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
              opacity: 0.85;
            }
          }
        }
      }
    }
    .noDataClass {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
