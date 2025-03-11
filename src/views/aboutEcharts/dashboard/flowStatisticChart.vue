<template>
  <div class="flowStatisticChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="flowStatisticChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { convertCountBinary } from '@/utils/convertCount'

export default {
  name: 'flowStatisticChart',
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
      defaultClient: 500
    }
  },
  methods: {
    binaryFilter(res) {
      let result = '--'
      if (res || res === 0) {
        const resultObj = convertCountBinary(res, 2)
        result = resultObj.value + resultObj.unit
      }
      return result
    },
    initCharts(data) {
      const self = this
      if (data && data.length > 0) {
        self.nochartdatas = false
        const dataX = data.map((item) => item.date)
        const dataUp = data.map((item) => item.in)
        const dataDown = data.map((item) => item.out)
        const percentZoom =
          data.length <= self.defaultClient
            ? 100
            : (self.defaultClient / data.length) * 100
        self.optionData = {
          legend: [
            {
              top: '0',
              right: '50',
              itemWidth: 15,
              itemHeight: 8,
              icon: 'rect',
              textStyle: {
                fontFamily: 'Alibaba-PuHuiTi-Regular'
              },
              data: ['上行流量', '下行流量']
            }
          ],
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
              params.forEach(item => {
                if (item) {
                  let item1 = `<div class="tool-row">
                  <div class="circle" style="background-color: ${item.color}"></div>
                  <div class="name-label">${item.seriesName}</div>
                  <div class="name-value">${self.binaryFilter(item.value)}</div>
                </div>`
                  result += item1
                }
              })
              result += `</div>`

              return result
            }
          },
          grid: {
            top: '30',
            right: '50',
            bottom: '50',
            left: '10',
            containLabel: true
          },
          // 缩放组件
          dataZoom: [
            // 给x轴设置滚动条
            {
              type: 'slider',
              start: 100 - percentZoom, // 默认为0
              end: 100,
              left: 30, // 左边的距离
              right: 50, // 右边的距离
              bottom: 10, // 下边的距离
              xAxisIndex: 0,
              z: 10
            },
            // 下面这个属性是里面拖动部分
            {
              type: 'inside',
              show: true,
              start: 80, // 默认为0
              end: 100 - percentZoom,
              xAxisIndex: 0,
              z: 10
            }
          ],
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
            data: dataX
          },
          yAxis: {
            type: 'value',
            name: '单位（B）',
            nameTextStyle: {
              fontFamily: 'Alibaba-PuHuiTi-Regular',
              align: 'left',
              padding: [0, 0, 3, 0]
            },
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
              data: dataUp,
              name: '上行流量',
              type: 'line',
              symbol: 'circle',
              symbolSize: 6,
              showSymbol: false,
              itemStyle: {
                color: '#64B5F6'
              },
              smooth: true
            },
            {
              data: dataDown,
              name: '下行流量',
              type: 'line',
              symbol: 'circle',
              symbolSize: 6,
              showSymbol: false,
              itemStyle: {
                color: '#F48FB1'
              },
              smooth: true
            }
          ]
        }
      } else {
        const myChart = self.$refs.flowStatisticChartRef.getChartInstance()
        myChart.clear()
        self.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.flowStatisticChart-page {
  width: 100%;
  height: 100%;
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
