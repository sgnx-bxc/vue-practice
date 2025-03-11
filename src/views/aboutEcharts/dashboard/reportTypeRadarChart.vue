<template>
  <div class="reportTypeRadarChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="reportTypeRadarChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { numberThousand } from '@/utils/dataFunction'

export default {
  name: 'reportTypeRadarChart',
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
        const indicator = data.map((item) => {
          const obj = { name: item.name, max: 5000 }
          return obj
        })
        const data1 = data.map((item) => item.value1)
        const data2 = data.map((item) => item.value2)
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
                <div class="tool-title">
                  <div class="circle" style="background-color: ${params.color}"></div>
                  <div class="name-tool">${params.data.name}</div>    
                </div>`
              params.value.forEach((item, index) => {
                if (item) {
                  let item1 = `<div class="tool-row">
                  <div class="name-label">
                    ${indicator[index].name}
                  </div>
                  <div class="name-value">
                    ${numberThousand(item)}
                  </div>
                </div>`
                  result += item1
                }
              })
              result += `</div>`
              return result
            }
          },
          legend: {
            top: 'middle',
            right: '35',
            itemWidth: 15,
            itemHeight: 8,
            icon: 'rect',
            orient: 'vertical',
            textStyle: {
              fontFamily: 'Alibaba-PuHuiTi-Regular'
            },
            data: ['类型维度', '主题维度']
          },
          radar: {
            radius: '80%',
            name: {
              textStyle: {
                fontFamily: 'Alibaba-PuHuiTi-Regular',
                fontSize: 12,
                color: '#2d2f33',
                padding: [-10, -10]
              }
            },
            splitArea: {
              areaStyle: {
                color: 'transparent'
              }
            },
            splitNumber: 5,
            center: ['35%', '50%'],
            indicator: indicator
          },
          series: [
            {
              name: '',
              type: 'radar',
              symbol: 'circle',
              symbolSize: 6,
              tooltip: {
                trigger: 'item'
              },
              data: [
                {
                  value: data1,
                  name: '类型维度',
                  itemStyle: {
                    color: '#64B5F6'
                  },
                  lineStyle: {
                    color: '#64B5F6'
                  },
                  areaStyle: {
                    opacity: 0.3,
                    color: '#64B5F6'
                  }
                },
                {
                  value: data2,
                  name: '主题维度',
                  itemStyle: {
                    color: '#F48FB1'
                  },
                  lineStyle: {
                    color: '#F48FB1'
                  },
                  areaStyle: {
                    opacity: 0.3,
                    color: '#F48FB1'
                  }
                }
              ]
            }
          ]
        }
      } else {
        const myChart = this.$refs.reportTypeRadarChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.reportTypeRadarChart-page {
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
    }
    .tool-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
