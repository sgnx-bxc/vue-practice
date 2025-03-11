<template>
  <div class="alarmTrendChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="alarmTrendChartChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { numberThousand } from '@/utils/dataFunction'

export default {
  name: 'alarmTrendChart',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nochartdatas: true,
      optionData: {}
    }
  },
  methods: {
    initCharts(data) {
      if (data && data.length > 0) {
        this.nochartdatas = false
        const xData = []
        const yData = []
        const xDetails = []
        data.forEach((item) => {
          xData.push(item.x)
          yData.push(item.y)
          xDetails.push(item.date)
        })
        this.optionData = {
          tooltip: {
            show: true,
            confine: true,
            trigger: 'axis',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            formatter: function (params) {
              const rowIndex = params[0].dataIndex
              const toolTip = `
              <div class="tool-name">
                <div>${xDetails[rowIndex]}</div>
                <div class="tool-title">
                  <div class="circle" style="background-color: ${params[0].color}"></div>
                  <div class="name-tool">告警次数</div>
                  <div class="name-value">${numberThousand(params[0].value)}</div>
                </div>
              </div>
            `
              return toolTip
            }
          },
          grid: {
            top: 6,
            right: 20,
            bottom: 0,
            left: 0,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              fontFamily: 'Alibaba-PuHuiTi-Regular',
              fontSize: 12,
              color: '#2d2f33'
            },
            axisTick: {
              show: false
            },
            data: xData
          },
          yAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
              fontFamily: 'Alibaba-PuHuiTi-Regular',
              fontSize: 12,
              color: '#2d2f33'
            },
            splitLine: {
              lineStyle: {
                color: '#f0f2f5'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          series: [
            {
              data: yData,
              type: 'line',
              symbol: 'circle',
              symbolSize: 6,
              showSymbol: false,
              itemStyle: {
                color: '#2985F7'
              },
              smooth: true,
              areaStyle: {
                opacity: 0.3,
                color: '#5B8FF9'
              }
            }
          ]
        }
      } else {
        const myChart = this.$refs.alarmTrendChartChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.alarmTrendChart-page {
  width: 100%;
  height: 100%;
  .tool-name {
    background: #ffffff;
    border: 1px solid #d9dfea;
    border-radius: 2px;
    box-shadow: 0px 4px 12px 0px rgba(14, 41, 109, 0.1);
    padding: 5px 10px;
    font-family: 'Alibaba-PuHuiTi-Regular';
    .tool-title {
      display: flex;
      align-items: center;
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
      }
    }
  }
}
</style>
