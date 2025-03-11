<template>
  <chartTool
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
  ></chartTool>
</template>

<script>
// 南丁格尔玫瑰饼图
import chartTool from '@/components/chart/chartTool'
import { getLimitLenString } from '@/utils/strUtils'
import { getValue } from '@/utils/convertCount'
export default {
  name: 'rosePieChart',
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
      default: 'rosePieChart'
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
    polarRadius: {
      type: String,
      default: '45%'
    },
    pieRadius: {
      type: Array,
      default: () => ['5%', '45%']
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
    this.option = this.initChart(this.datas)
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
      const valueMap = {}
      const pieDatas = datas.map(item => {
        const obj = {
          name: item[self.dataKey] || '',
          value: item[self.dataValue] || 0
        }
        valueMap[obj.name] = obj.value
        return obj
      })
      const legend = {
        show: this.showLegend,
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
        color: this.pieRGBColors,
        tooltip: {
          trigger: 'item',
          formatter(item) {
            const value = getValue(item.value, self.unitType)
            return `${item.name}：<br />${value}（${item.percent}%）`
          }
        },
        legend: legend,
        // 极坐标装饰
        polar: {
          show: this.showBg,
          center: this.center,
          radius: this.polarRadius
        },
        angleAxis: {
          show: this.showBg,
          interval: 1,
          type: 'category',
          data: [],
          z: 10,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        radiusAxis: {
          show: this.showBg,
          min: 5,
          max: 120,
          interval: 30,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(34, 69, 126, 0.4)',
              width: 2,
              type: 'solid'
            }
          }
        },
        calculable: true,
        series: [
          // 主图层
          {
            type: 'pie',
            radius: this.pieRadius,
            center: this.center,
            roseType: 'area',
            zlevel: 10,
            tooltip: {
              trigger: 'item'
            },
            label: {
              show: true,
              fontSize: 13,
              position: 'outside',
              formatter: '{d}%'
            },
            labelLine: {
              normal: {
                show: true,
                length: 6,
                length2: 10
              },
              emphasis: {
                show: false
              }
            },
            data: pieDatas
          }
        ]
      }
      // 背景bar的配置项
      if (this.showBg) {
        // 中心装饰
        option.series.push({
          type: 'pie',
          radius: ['2%', '3%'],
          center: this.center,
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          tooltip: {
            show: false
          },
          itemStyle: {
            normal: {
              color: 'rgba(34, 69, 126, 0.4)'
            }
          },
          data: [0]
        })
      }
      this.chartdatas = pieDatas
      this.option = option
      return option
    }
  }
}
</script>
