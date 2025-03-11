<template>
  <div class="alarmEventType-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="alarmEventTypeChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { getLimitLenString, numberThousand } from '@/utils/dataFunction'

export default {
  name: 'alarmEventType',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return { nochartdatas: true, optionData: {} }
  },
  methods: {
    initCharts(data) {
      if (data && data.length > 0) {
        this.nochartdatas = false
        data.sort((a, b) => a.hCount - b.hCount)
        const dataX1 = data.map((item) => {
          return item.hCount
        })
        const dataX2 = data.map((item) => {
          return item.unHStatus
        })
        const dataY = data.map((item) => {
          return item.alarmTags
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
              let result = `<div class="tool-name">
                <div class="tool-title">${params[0].axisValueLabel}</div>`
              params.forEach((item) => {
                if (item) {
                  let item1 = `<div class="tool-row">
                  <div class="circle" style="background-color: ${item.color}"></div>
                  <div class="name-label">${item.seriesName}</div>
                  <div class="name-value">${numberThousand(item.value)}</div>
                </div>`
                  result += item1
                }
              })
              result += `</div>`
              return result
            }
          },
          grid: {
            top: 30,
            left: 0,
            bottom: 0,
            right: 0,
            containLabel: true
          },
          legend: {
            icon: 'rect',
            right: 0,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
              fontFamily: 'Alibaba-PuHuiTi-Regular',
              fontSize: 14,
              color: '#2d2f33'
            }
          },
          xAxis: {
            show: false,
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            data: dataY,
            axisLine: {
              lineStyle: {
                color: '#d6dde5'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#2d2f33',
                fontSize: 14,
                fontFamily: 'Alibaba-PuHuiTi-Regular'
              },
              formatter: function (name) {
                const result = getLimitLenString(name, 12)
                return result
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '全部事件',
              type: 'bar',
              barWidth: 10,
              zlevel: 2,
              itemStyle: {
                color: '#2985F7'
              },
              data: dataX1
            },
            {
              name: '未处置事件',
              type: 'bar',
              barWidth: 10,
              zlevel: 2,
              itemStyle: {
                color: '#FFAD44'
              },
              data: dataX2
            }
          ]
        }
      } else {
        const myChart = this.$refs.alarmEventTypeChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.alarmEventType-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .tool-name {
    background: #ffffff;
    border: 1px solid #d9dfea;
    border-radius: 2px;
    box-shadow: 0px 4px 12px 0px rgba(14, 41, 109, 0.1);
    font-family: 'Alibaba-PuHuiTi-Regular';
    padding: 5px 10px;
    .tool-title {
      display: flex;
      align-items: center;
      .name-tool {
        margin-left: 8px;
        margin-right: 20px;
      }
    }
    .tool-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .circle {
        width: 8px;
        height: 8px;
        background: #2985f7;
        border-radius: 50%;
        margin-right: 6px;
      }
      .name-label {
        margin-right: 20px;
        font-family: 'Alibaba-PuHuiTi-Regular';
      }
      .name-value {
        font-family: 'Alibaba-PuHuiTi-Medium';
      }
    }
  }
}
</style>
