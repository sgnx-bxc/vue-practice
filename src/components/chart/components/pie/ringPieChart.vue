<template>
  <chartTool
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
    :isSVGRender="isSVGRender"
  ></chartTool>
</template>

<script>
// 环形饼图
import chartTool from '@/components/chart/chartTool'
import { getLimitLenString } from '@/utils/strUtils'
import { getValue } from '@/utils/convertCount'
export default {
  name: 'ringPieChart',
  components: { chartTool },
  data() {
    return {
      // 配置项
      option: {},
      chartdatas: []
    }
  },
  props: {
    // 是否使用svg渲染，默认canvas
    isSVGRender: {
      type: Boolean,
      default: false
    },
    // echarts dom对应id
    charId: {
      type: String,
      required: true,
      default: 'ringPieChart'
    },
    // 图表数据
    datas: {
      type: Array,
      default: () => {
        return []
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
    // 数据是否需要排序
    isSort: {
      type: Boolean,
      default: true
    },
    /* 图表参数 */
    // 饼图radius
    radius: {
      type: Array,
      default: () => ['25%', '45%']
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
    // 显示饼图半透明背景
    showBg: {
      type: Boolean,
      default: true
    },
    // 是否显示饼图label
    showLabel: {
      type: Boolean,
      default: true
    },
    // label样式
    labelStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // label引线长度
    labelLine: {
      type: Object,
      default: () => {
        return {
          length: 10,
          length2: 15
        }
      }
    },
    // 是否显示legend
    showLegend: {
      type: Boolean,
      default: true
    },
    // legend参数
    legendOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否限制legend系列名称显示长度
    limitLengendLabel: {
      type: Boolean,
      default: true
    },
    // 字符串限制长度
    limitLabelLen: {
      type: Number,
      default: 8
    },
    // 起始角度
    startAngle: {
      type: Number,
      default: 90
    },
    // mouthed时初始化chart
    initInMounted: {
      type: Boolean,
      default: true
    },
    // legend是否显示value值
    legendShowValue: {
      type: Boolean,
      default: true
    },
    // title是否显示
    showTitle: {
      type: Boolean,
      default: false
    },
    // title显示文字
    titleText: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    if (this.initInMounted) {
      this.initChart(this.datas)
    }
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
      // 排序
      if (this.isSort) {
        pieDatas.sort((a, b) => {
          return b.value - a.value
        })
      }
      const legend = {
        show: this.showLegend,
        right: '6%',
        top: 'center',
        height: '80%',
        orient: 'vertical',
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 10,
        icon: 'circle',
        textStyle: {
          fontSize: 10,
          rich: {
            name: {
              color: '#666',
              padding: [3, 0],
              // width: 60,
              align: 'left',
              borderColor: '#ccc'
            },
            percent: {
              color: '#666',
              padding: [3, 0, 3, 5],
              align: 'right',
              borderColor: '#ccc'
            }
          }
        },
        formatter: function(name) {
          const target = valueMap[name]
          const value = getValue(target, self.unitType)
          if (self.legendShowValue) {
            return `{name|${getLimitLenString(
              name,
              self.limitLabelLen,
              self.limitLengendLabel
            )}}{percent|${value}}`
          } else {
            return `{name|${getLimitLenString(
              name,
              self.limitLabelLen,
              self.limitLengendLabel
            )}}`
          }
        },
        ...this.legendOption
      }
      const labelStyle = {
        show: this.showLabel,
        formatter: '{d}%',
        fontSize: 12,
        color: '#333',
        ...this.labelStyle
      }
      // 设置图表option
      const option = {
        title: {
          show: this.showTitle,
          text: this.titleText,
          top: '30%',
          x: 'center',
          itemGap: 5,
          textStyle: {
            fontSize: '20px',
            fontWeight: 700,
            color: '#303133'
          },
          subtext: '涉及分区数',
          subtextStyle: {
            fontSize: '10px',
            fontWeight: 400,
            color: '#656668'
          }
        },
        tooltip: {
          trigger: 'item',
          show: true
        },
        legend: legend,
        series: [
          // 主要展示图层
          {
            type: 'pie',
            selectedMode: false, // 'single',
            startAngle: this.startAngle,
            radius: this.radius,
            center: this.center,
            color: this.pieRGBColors,
            data: pieDatas,
            label: labelStyle,
            labelLine: this.labelLine,
            tooltip: {
              trigger: 'item',
              formatter(item) {
                const value = getValue(item.value, self.unitType)
                return `${item.name}：<br />${value}（${item.percent}%）`
              }
            }
          }
        ]
      }
      // 背景pie的配置项
      if (this.showBg) {
        let bgradius1 = this.radius[1]
        bgradius1 = parseInt(bgradius1.slice(0, bgradius1.length - 1)) - 3.5
        const bgradius = [bgradius1 + '%', this.radius[1]]
        option.series.push({
          type: 'pie',
          radius: bgradius,
          center: this.center,
          data: pieDatas,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          animation: false,
          tooltip: {
            show: false
          },
          itemStyle: {
            normal: {
              color: 'rgba(255,255,255,0.2)'
            }
          }
        })
      }
      this.chartdatas = pieDatas
      this.option = option
      return option
    }
  }
}
</script>
