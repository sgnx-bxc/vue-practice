<template>
  <div class="highFreqTop10Chart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="highFreqTop10ChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { getLimitLenString, numberThousand } from '@/utils/dataFunction'

export default {
  name: 'highFreqTop10Chart',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nochartdatas: true,
      optionData: {},
      limitLen: 12,
      defaultClient: 5
    }
  },
  methods: {
    initCharts(data) {
      const self = this
      if (data && data.length > 0) {
        self.nochartdatas = false
        data.sort((a, b) => a.value - b.value)
        const percentZoom =
          data.length <= self.defaultClient
            ? 100
            : (self.defaultClient / data.length) * 100
        const dataY = data.map((item) => item.name)
        self.optionData = {
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
                </div>
              </div>
            `
              return toolTip
            }
          },
          grid: {
            top: '0',
            left: '0',
            right: '60',
            bottom: '0',
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              start: 100 - percentZoom,
              width: 20,
              end: 100,
              right: 0,
              top: 0,
              bottom: 20,
              showDetail: false,
              yAxisIndex: 0,
              z: 10
            },
            {
              type: 'inside',
              show: true,
              start: 80,
              end: 100 - percentZoom,
              yAxisIndex: 0,
              z: 10
            }
          ],
          xAxis: {
            show: false
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              color: '#2d2f33',
              fontSize: 12,
              fontFamily: 'Alibaba-PuHuiTi-Regular',
              formatter: (name) => {
                return getLimitLenString(name, self.limitLen)
              }
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: dataY
          },
          series: [
            {
              name: '',
              type: 'bar',
              barWidth: 16,
              itemStyle: {
                color: self.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#81d2e0' },
                  { offset: 1, color: '#5191ff' }
                ])
              },
              label: {
                show: true,
                position: 'right',
                color: '#ff7b74',
                fontSize: 12,
                fontFamily: 'Alibaba-PuHuiTi-Regular',
                formatter: (params) => {
                  const result = numberThousand(params.value)
                  return result
                }
              },
              data: data
            }
          ]
        }
      } else {
        const myChart = self.$refs.highFreqTop10ChartRef.getChartInstance()
        myChart.clear()
        self.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.highFreqTop10Chart-page {
  width: 100%;
  height: 100%;
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
    }
  }
}
</style>
