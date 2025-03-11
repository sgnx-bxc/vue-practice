<template>
  <div class="highRiskPrecentChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="highRiskPrecentChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
export default {
  name: 'highRiskPrecentChart',
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
      if (data || data === 0) {
        this.nochartdatas = false
        this.optionData = {
          title: [
            {
              text: (data * 100).toFixed(0) + '{a|%}',
              left: 'center',
              top: '30%',
              textStyle: {
                fontSize: 24,
                textAlign: 'center',
                fontFamily: 'Alibaba-PuHuiTi-Regular',
                color: '#ff7b74',
                rich: {
                  a: {
                    fontSize: 16,
                    textAlign: 'center',
                    verticalAlign: 'bottom'
                  }
                }
              }
            },
            {
              text: '危险资产',
              left: 'center',
              top: '45%',
              textStyle: {
                fontSize: 24,
                color: '#878d99',
                textAlign: 'center',
                fontFamily: 'Alibaba-PuHuiTi-Regular'
              }
            }
          ],
          series: [
            {
              type: 'liquidFill',
              radius: '94%', // 显示比例
              center: ['50%', '50%'], // 中心点
              amplitude: 20, // 水波振幅
              data: [data, data], // data个数代表波浪数
              color: [
                {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#64B5F6'
                    },
                    {
                      offset: 1,
                      color: '#F48FB1'
                    }
                  ],
                  globalCoord: false
                }
              ], // 波浪颜色
              backgroundStyle: {
                borderWidth: 1, // 外边框
                color: '#f1f7ff' // 边框内部填充部分颜色
              },
              label: {
                formatter: '' // 显示文本
              },
              outline: {
                borderDistance: 2,
                itemStyle: {
                  borderWidth: 2,
                  borderColor: '#64B5F6'
                }
              }
            }
          ]
        }
      }
    }
  }
}
</script>

<style lang="less">
.highRiskPrecentChart-page {
  width: 100%;
  height: 100%;
}
</style>
