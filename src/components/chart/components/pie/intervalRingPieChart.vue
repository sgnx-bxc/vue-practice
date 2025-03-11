<template>
  <chartTool
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
  ></chartTool>
</template>

<script>
// 间隔圆角圆环饼图
import chartTool from '@/components/chart/chartTool'
import { getLimitLenString } from '@/utils/strUtils'
import { getValue } from '@/utils/convertCount'
export default {
  name: 'intervalRingPieChart',
  components: { chartTool },
  data() {
    return {
      // 配置项
      option: {},
      chartdatas: []
    }
  },
  props: {
    charId: {
      type: String,
      required: true,
      default: 'intervalRingPieChart'
    },
    // 图表数据
    datas: {
      type: Array,
      default: () => {
        return [
          {
            key: 'aaa',
            value: 1
          },
          {
            key: 'bbb',
            value: 2
          }
        ]
      }
    },
    /* 数据参数 */
    // 数据中的系列字段
    dataKey: {
      type: String,
      default: 'key'
    },
    // 数据中的数值字段
    dataValue: {
      type: String,
      default: 'value'
    },
    // 数值单位类型，0不转换，1十进制，2二进制
    unitType: {
      type: Number,
      default: 0
    },
    /* 图表参数 */
    // 饼图radius
    radius: {
      type: Array,
      default: () => ['32%', '40%']
    },
    // 饼图位置
    center: {
      type: Array,
      default: () => ['40%', '50%']
    },
    // 饼图rgb颜色
    pieRGBColors: {
      type: Array,
      default: () => [
        'rgb(64, 133, 255)',
        'rgb(58, 175, 255)',
        'rgb(175, 163, 245)',
        'rgb(133, 120, 255)',
        'rgb(0, 212, 136)',
        'rgb(61, 238, 211)'
      ]
    },
    // 显示极坐标及中心装饰
    showBg: {
      type: Boolean,
      default: true
    },
    // 是否显示legend
    showLegend: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.initChart(this.datas)
  },
  methods: {
    initChart(ds = []) {
      if (ds.length === 0) {
        this.option = {}
        this.chartdatas = []
        return {}
      }
      const self = this
      let datas = ds
      // 处理图表数据
      let sum = 0
      const valueMap = {}
      const pieDatas = datas.map(item => {
        const obj = {
          name: item[self.dataKey] || '',
          value: item[self.dataValue] || 0
        }
        sum += obj.value
        valueMap[obj.name] = obj.value
        return obj
      })
      // 计算系列百分比
      let presum = 0
      const len = pieDatas.length
      const preMap = {}
      pieDatas.forEach((item, index) => {
        let pre = parseFloat(((item.value / sum) * 100).toFixed(2))
        if (index === len - 1) {
          pre = parseFloat((100 - presum).toFixed(2))
        } else {
          presum += pre
        }
        preMap[item.name] = pre
      })
      // 间隔值
      let intervalValue = (sum / pieDatas.length) * 0.12
      if (pieDatas.length === 1) {
        intervalValue = 0
      }
      // 环形样式
      let data = []
      pieDatas.forEach((item, index) => {
        const i = index % self.pieRGBColors.length
        data.push(
          {
            value: item.value,
            name: item.name,
            itemStyle: {
              normal: {
                borderWidth: 2,
                shadowBlur: 5,
                color: self.pieRGBColors[i],
                borderColor: self.pieRGBColors[i],
                shadowColor: self.pieRGBColors[i]
              }
            },
            label: {
              formatter(params) {
                return `${preMap[params.name]}%`
              },
              fontSize: 13,
              color: '#333'
            },
            labelLine: {
              length: 10,
              length2: 15
            }
          },
          {
            value: intervalValue,
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            }
          }
        )
      })
      // legend
      const legendData = pieDatas.map(item => item.name)
      const legend = {
        show: this.showLegend,
        data: legendData,
        right: '20',
        top: 'center',
        orient: 'vertical',
        itemWidth: 20,
        itemHeight: 12,
        itemGap: 10,
        textStyle: {
          fontSize: 10,
          rich: {
            name: {
              color: '#333333',
              padding: [3, 0],
              width: 60,
              align: 'left',
              borderColor: '#ccc'
            },
            percent: {
              color: '#333333',
              padding: [3, 0],
              align: 'right',
              borderColor: '#ccc'
            }
          }
        },
        formatter: function(name) {
          const target = valueMap[name]
          const value = getValue(target, self.unitType)
          return `{name|${getLimitLenString(name, 6)}}{percent|${value}}`
        }
      }
      // 设置图表option
      const option = {
        tooltip: {
          trigger: 'item',
          formatter(item) {
            const value = getValue(item.value, self.unitType)
            return `${item.name}：<br />${value}（${preMap[item.name]}%）`
          }
        },
        legend: legend,
        series: [
          {
            type: 'pie',
            clockWise: false,
            radius: this.radius,
            center: this.center,
            hoverAnimation: false,
            data: data
          }
        ]
      }
      this.chartdatas = pieDatas
      this.option = option
      return option
    }
  }
}
</script>
