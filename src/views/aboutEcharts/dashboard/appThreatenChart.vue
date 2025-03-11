<template>
  <div class="appThreatenChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="appThreatenChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { getLimitLenString, numberThousand } from '@/utils/dataFunction'

export default {
  name: 'appThreatenChart',
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
        const dataX = data.map((item) => item.name)
        const dataY = data.map((item) => item.count)
        this.optionData = {
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            confine: true,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            formatter: function (params) {
              const toolTip = `
              <div class="tool-name">
                <div class="circle"></div>
                <div class="name-tool">${params[0].axisValueLabel}</div>
                <div class="name-value">${numberThousand(params[0].value)}</div>
              </div>
            `
              return toolTip
            }
          },
          grid: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0,
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
          xAxis: [
            {
              type: 'category',
              data: dataX,
              axisLabel: {
                color: '#2d2f33',
                formatter: function (params) {
                  return getLimitLenString(params, 6)
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#d9dbde'
                }
              },
              axisTick: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                fontSize: 12,
                color: '#2d2f33'
              },
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  color: '#f0f2f5'
                }
              }
            }
          ],
          series: [
            {
              name: '威胁次数',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#53BBFC' },
                  { offset: 1, color: '#2985F7' }
                ])
              },
              data: dataY
            }
          ]
        }
      } else {
        const myChart = this.$refs.appThreatenChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.appThreatenChart-page {
  width: 100%;
  height: 100%;
  .tool-name {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #d9dfea;
    border-radius: 2px;
    box-shadow: 0px 4px 12px 0px rgba(14, 41, 109, 0.1);
    padding: 5px 10px;
    font-family: 'Alibaba-PuHuiTi-Regular';
    .circle {
      width: 8px;
      height: 8px;
      background: linear-gradient(180deg, #53bbfc, #2985f7);
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
</style>
