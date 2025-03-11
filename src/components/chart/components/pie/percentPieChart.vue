<template>
  <chartTool
    :id="charId"
    :option="option"
    :isSVGRender="isSVGRender"
  ></chartTool>
</template>

<script>
// 百分比环形图
import chartTool from '@/components/chart/chartTool'
export default {
  name: 'percentPieChart',
  components: { chartTool },
  data() {
    return {
      // 配置项
      option: {}
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
      default: 'percentPieChart'
    },
    // 图表数据
    // 占比
    value: {
      type: Number,
      default: 100
    },
    // 数量
    count: {
      type: Number,
      default: 100
    },
    // 名称
    text: {
      type: String,
      default: '百分比'
    },
    /* 图表参数 */
    // radius
    radius: {
      type: Array,
      default: () => ['65%', '80%']
    },
    // 位置
    center: {
      type: Array,
      default: () => ['50%', '50%']
    },
    // rgb颜色
    pieColor: {
      type: String,
      default: 'rgb(64, 133, 255)'
    },
    // 中间是否显示文本名称
    showText: {
      type: Boolean,
      default: true
    },
    // 中间显示数量，否则显示百分比
    showCount: {
      type: Boolean,
      default: true
    },
    // mounted时是否初始化chart
    initInMounted: {
      type: Boolean,
      default: true
    },
    // 中间文本样式
    textStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 中间数值样式
    countStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    if (this.initInMounted) {
      this.initChart()
    }
  },
  methods: {
    initChart() {
      const self = this
      const value = this.value
      // 设置图表option
      let title = []
      if (this.showText) {
        // 中间内容：显示文本+占比/数量
        title = [
          {
            text: this.text,
            x: 'center',
            top: '34%',
            textStyle: {
              color: '#333',
              fontSize: 12,
              fontWeight: '400',
              ...this.textStyle
            }
          },
          {
            text: this.showCount ? this.count : value + '%',
            x: 'center',
            top: '50%',
            textStyle: {
              fontSize: 16,
              color: '#333',
              fontWeight: '600',
              ...this.countStyle
            }
          }
        ]
      } else {
        // 中间内容：显示占比/数量
        title = [
          {
            text: this.showCount ? this.count : value + '%',
            x: 'center',
            top: '43%',
            textStyle: {
              fontSize: 16,
              color: '#333',
              fontWeight: '600',
              ...this.countStyle
            }
          }
        ]
      }
      const option = {
        color: [this.pieColor, '#f5f6fa'],
        tooltip: {
          trigger: 'item',
          show: true,
          confine: true,
          position: function(point, params, dom, rect, size) {
            return [point[1], 0]
          },
          formatter(item) {
            return `${self.text}：<br />${self.count}（${value}%）`
          }
        },
        title: title,
        series: [
          {
            type: 'pie',
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: '#f5f6fa'
            },
            radius: this.radius,
            center: this.center,
            label: {
              show: false
            },
            data: [
              {
                name: '占比',
                value: value,
                itemStyle: {
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: '#f5f6fa',
                  shadowBlur: 20,
                  shadowColor: '#f5f6fa'
                }
              },
              {
                name: '',
                value: 100 - value
              }
            ]
          }
        ]
      }
      this.option = option
      return option
    }
  }
}
</script>
