<template>
  <chartTool
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
    :isBindClick="isBindClick"
    :isSVGRender="isSVGRender"
    @chartClick="chartClick"
  ></chartTool>
</template>

<script>
// 柱状图
import chartTool from '@/components/chart/chartTool'
import { getLimitLenString } from '@/utils/strUtils'
import { getValue } from '@/utils/convertCount'
export default {
  name: 'barChart',
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
      default: 'barChart'
    },
    // 图表数据
    datas: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 方向 H--水平 V--垂直
    direction: {
      type: String,
      default: 'H'
    },
    /* 数据参数 */
    // 数据中的系列字段
    dataKey: {
      type: String,
      default: 'key'
    },
    // 数据中的数值字段
    dataValueList: {
      type: Array,
      default: () => [
        {
          name: '类型一',
          key: 'value',
          color: [
            1,
            0,
            0,
            0,
            [
              { offset: 1, color: 'rgb(0, 135, 210)' },
              { offset: 0, color: 'rgb(36, 172, 242)' }
            ]
          ]
        },
        {
          name: '类型二',
          key: 'value1',
          color: [
            1,
            0,
            0,
            0,
            [
              { offset: 1, color: 'rgb(57, 92, 213)' },
              { offset: 0, color: 'rgb(88, 108, 175)' }
            ]
          ]
        }
      ]
    },
    // 数值偏移量
    offsetChange: {
      type: Array,
      default: () => {
        return [5, 1]
      }
    },
    // 限制数据最大个数，0为不限制
    maxData: {
      type: Number,
      default: 0
    },
    // 数值单位类型，0不转换，1十进制，2二进制
    unitType: {
      type: Number,
      default: 0
    },
    // 单柱形显示name名
    showName: {
      type: Boolean,
      default: false
    },
    /* 图表参数 */
    // 柱子是否为纯色
    rgbBarColor: {
      type: Boolean,
      default: false
    },
    // 显示柱子底部背景
    showBarBg: {
      type: Boolean,
      default: false
    },
    // 柱子圆角半径
    barBorderRadius: {
      // type: Number | Array,
      default: 0
    },
    // 柱宽
    barWidth: {
      type: Number,
      default: 16
    },
    // 最大柱宽
    barMaxWidth: {
      type: Number,
      default: 0
    },
    // 是否显示legend
    showlengend: {
      type: Boolean,
      default: true
    },
    // 是否显示Y轴label
    showYaxisLabel: {
      type: Boolean,
      default: true
    },
    // 是否显示X轴label
    showXaxisLabel: {
      type: Boolean,
      default: true
    },
    // label字符串长度
    limitLen: {
      type: Number,
      default: 6
    },
    // 是否显示滚动条
    showDataZoom: {
      type: Boolean,
      default: false
    },
    // 是否显示柱上数值
    showBarValue: {
      type: Boolean,
      default: false
    },
    // 标注是否显示在上方，为false是并排显示
    labelOnTop: {
      type: Boolean,
      default: false
    },
    // 滚动条显示的初始化条数
    dataZoomLen: {
      type: Number,
      default: 5
    },
    // 滚动条缩放组件的配置
    dataZoom: {
      type: Array,
      default: null
    },
    // 数据是否排序
    isSort: {
      type: Boolean,
      default: true
    },
    // 坐标系参数
    grid: {
      type: Object,
      default: () => {
        return {
          top: '70',
          left: '30',
          right: '30',
          bottom: '10',
          containLabel: true
        }
      }
    },
    // 设置lenged方向、大小
    lengeds: {
      type: Object,
      default: () => {
        return {
          top: 20,
          right: 30,
          itemWidth: 10,
          itemHeight: 10
        }
      }
    },
    // lenged图例字体大小
    lengendFontSize: {
      type: Number,
      default: 12
    },
    // lengend图例方向  水平-horizontal，垂直-vertical
    lengendOrient: {
      type: String,
      default: 'horizontal'
    },
    // tooltip配置
    tooltips: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否绑定点击事件
    isBindClick: {
      type: Boolean,
      default: false
    },
    // 是否显示axisLine
    showAxisLine: {
      type: Boolean,
      default: false
    },
    // 自定义tooltip格式的方法
    tooltipFormatter: {
      type: Function,
      default: null
    },
    // 垂直柱状图的x轴标签样式
    VxAxisAxisLabel: {
      type: Object,
      default: null
    },
    //
    rotateValue: {
      type: Number,
      default: 25
    },
    splitShow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // y轴最大值
    maxSumValue: {
      type: Number,
      default: null
    },
    // barValue显示格式
    BarValueBoolean: {
      type: Boolean,
      default: false
    },
    // lenged图例颜色
    lengedColor: {
      type: String,
      default: '#666'
    },
    // 垂直x轴颜色
    xAxisColor: {
      type: String,
      default: '#666'
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
      // 每项求和
      datas.forEach((item) => {
        let sum = 0
        self.dataValueList.forEach((xKeyObj) => {
          sum += parseFloat(item[xKeyObj.key] || 0)
        })
        item.sum = sum
      })
      // 排序
      if (this.isSort) {
        datas.sort((a, b) => {
          return b.sum - a.sum
        })
      }
      // 取前N
      if (this.maxData !== 0) {
        datas = datas.splice(0, this.maxData)
      }
      // 和的映射
      const sumMap = {}
      datas.forEach((item, index) => {
        let key = item[self.dataKey] || ''
        key = `${key}${index}`
        sumMap[key] = item.sum
      })
      // 最大值
      const maxValue = datas[0].sum
      const maxValueArr = new Array(datas.length).fill(maxValue)
      // 处理图表数据
      const series = []
      const legend = new Set()
      const datasY = []
      const datasX = new Array(this.dataValueList.length).fill()
      datas.forEach((item) => {
        datasY.push(item[self.dataKey] || '')
        self.dataValueList.forEach((xKeyObj, index) => {
          if (!datasX[index]) {
            datasX[index] = []
          }
          datasX[index].push(parseFloat(item[xKeyObj.key] || 0))
          legend.add(xKeyObj.name)
        })
      })
      // 水平和垂直柱形图的配置差异项，主要是x轴和y轴
      const dataZoomEnd =
        datasY.length <= this.dataZoomLen
          ? 100
          : (this.dataZoomLen / datasY.length) * 100
      let HAxisLabel = {}
      if (this.labelOnTop) {
        HAxisLabel = {
          verticalAlign: 'bottom',
          align: 'left',
          padding: [0, 0, 8, 10]
        }
      }
      let VxAxisAxisLabel = {
        show: this.showXaxisLabel,
        interval: 0, // 显示所有X轴label
        rotate: this.rotateValue,
        color: this.xAxisColor,
        textStyle: {
          fontSize: 12
        },
        formatter: (name) => {
          return getLimitLenString(name, self.limitLen)
        }
      }
      if (this.VxAxisAxisLabel !== null) {
        VxAxisAxisLabel = this.VxAxisAxisLabel
      }
      const barOption = {
        // 水平
        H: {
          position: this.labelOnTop
            ? ['90%', `-${this.barWidth + 2}px`]
            : 'right',
          offset: this.offsetChange,
          xAxis: {
            show: false,
            type: 'value',
            max: this.maxSumValue
          },
          yAxis: {
            type: 'category',
            inverse: true,
            gridIndex: 0,
            axisLabel: {
              show: true,
              color: '#666',
              textStyle: {
                fontSize: 12
              },
              formatter: function (name) {
                return getLimitLenString(name, self.limitLen)
              },
              ...HAxisLabel
            },
            splitLine: {
              show: false,
              lineStyle: this.splitShow
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: this.showAxisLine,
              lineStyle: {
                color: 'rgba(230, 230, 230, 1)',
                width: 2
              }
            },
            data: datasY
          },
          dataZoom: [
            // 给y轴设置滚动条
            {
              type: 'slider',
              start: 0, // 默认为0
              end: dataZoomEnd,
              handleSize: 0, // 滑动条的左右2个滑动条的大小
              width: 5, // 组件高度
              right: 10, // 右边的距离
              top: 0,
              bottom: 5, // 下边的距离
              fillerColor: 'rgba(213, 219, 228, 1)',
              backgroundColor: 'rgba(213, 219, 228, 0.37)', // 两边未选中的滑动条区域的颜色
              borderRadius: 0,
              showDataShadow: false, // 是否显示数据阴影 默认auto
              showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
              filterMode: 'filter',
              yAxisIndex: 0,
              z: 10
            },
            // 下面这个属性是里面拖动部分
            {
              type: 'inside',
              start: 0, // 默认为0
              end: dataZoomEnd,
              yAxisIndex: 0,
              z: 10
            }
          ]
        },
        // 垂直
        V: {
          position: 'top',
          offset: 0,
          xAxis: {
            boundaryGap: true,
            axisLabel: VxAxisAxisLabel,
            axisTick: {
              show: false
            },
            axisLine: {
              show: this.showAxisLine,
              lineStyle: {
                color: 'rgba(230, 230, 230, 1)',
                width: 2
              }
            },
            data: datasY
          },
          yAxis: {
            splitNumber: 3,
            axisLabel: {
              show: this.showYaxisLabel,
              color: '#cbcbcb',
              formatter: function (name) {
                const value = getValue(name, self.unitType)
                return value
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: this.showYaxisLabel,
              lineStyle: this.splitShow
            }
          },
          dataZoom: [
            // 给x轴设置滚动条
            {
              type: 'slider',
              start: 0, // 默认为0
              end: dataZoomEnd,
              handleSize: 0, // 滑动条的 左右2个滑动条的大小
              height: 5, // 组件高度
              left: 0, // 左边的距离
              right: 5, // 右边的距离
              bottom: 10, // 下边的距离
              fillerColor: 'rgba(213, 219, 228, 1)',
              backgroundColor: 'rgba(213, 219, 228, 0.37)', // 两边未选中的滑动条区域的颜色
              borderRadius: 0,
              showDataShadow: false, // 是否显示数据阴影 默认auto
              showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
              filterMode: 'filter',
              xAxisIndex: 0,
              z: 10
            },
            // 下面这个属性是里面拖动部分
            {
              type: 'inside',
              show: true,
              start: 0, // 默认为0
              end: dataZoomEnd,
              xAxisIndex: 0,
              z: 10
            }
          ]
        }
      }
      // 处理柱形series数据
      datasX.forEach((data, index) => {
        const xKeyObj = self.dataValueList[index]
        const serie = {
          name: xKeyObj.name,
          zlevel: 1,
          type: xKeyObj.type || 'bar',
          stack: xKeyObj.stack || 'bar',
          itemStyle: {
            normal: {
              barBorderRadius: this.barBorderRadius,
              color: this.rgbBarColor
                ? xKeyObj.color
                : new this.$echarts.graphic.LinearGradient(...xKeyObj.color)
            }
          },
          label: {
            normal: {
              show:
                this.showBarValue &&
                !this.showBarBg &&
                index === datasX.length - 1,
              color: '#cbcbcb',
              position: barOption[this.direction].position,
              offset: barOption[this.direction].offset,
              textStyle: {
                fontSize: 12
              },
              formatter: function (params) {
                const key = `${params.name}${params.dataIndex}`
                const value = getValue(sumMap[key], self.unitType)
                return value
              }
            }
          },
          data: data
        }
        if (this.barMaxWidth !== 0) {
          serie.barMaxWidth = this.barMaxWidth
        } else {
          serie.barWidth = this.barWidth
        }
        series.push(serie)
      })
      const dataZoomDisabled = [
        {
          type: 'inside',
          show: false
        },
        {
          type: 'slider',
          show: false
        }
      ]
      let dataZoom = null
      if (this.showDataZoom) {
        if (this.dataZoom !== null) {
          dataZoom = this.dataZoom
        } else {
          dataZoom = barOption[this.direction].dataZoom
        }
      } else {
        dataZoom = dataZoomDisabled
      }
      // 设置图表option
      let tooltipformat = this.defaultTooltipFormatter
      if (this.tooltipFormatter !== null) {
        tooltipformat = this.tooltipFormatter
      }
      const option = {
        tooltip: {
          show: true,
          trigger: 'axis',
          confine: true, // 将 tooltip 框限制在图表的区域内
          ...this.tooltips,
          // position: (point, params, dom, rect, size) => {
          //   return [point[0] + 10, point[1] - 0]
          // },
          formatter: tooltipformat
        },
        grid: this.grid,
        legend: {
          show: this.showlengend,
          data: [...legend],
          orient: this.lengendOrient,
          ...this.lengeds,
          // top: 20,
          // right: 30,
          // itemWidth: 10,
          // itemHeight: 10,
          itemGap: 12,
          textStyle: {
            color: this.lengedColor,
            fontSize: this.lengendFontSize,
            padding: 5
          }
        },
        dataZoom: dataZoom,
        xAxis: barOption[this.direction].xAxis,
        yAxis: barOption[this.direction].yAxis,
        series: series
      }
      // 背景bar的配置项
      if (this.showBarBg) {
        const serie = {
          name: '总数',
          type: 'bar',
          barGap: '-100%',
          data: maxValueArr,
          label: {
            normal: {
              show: this.showBarValue,
              color: '#cbcbcb',
              position:
                self.BarValueBoolean === false
                  ? barOption[this.direction].position
                  : ['70%', -14],
              offset:
                self.BarValueBoolean === false
                  ? barOption[this.direction].offset
                  : [5, 1],
              textStyle: {
                fontSize: 12
              },
              formatter: function (params) {
                const key = `${params.name}${params.dataIndex}`
                const value = getValue(sumMap[key], self.unitType)
                let data =
                  self.BarValueBoolean === false ? value : `告警{a|${value}}条`
                return data
              },
              rich: {
                a: {
                  color: '#ff9e86'
                }
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#E5EFFA',
              barBorderRadius: this.barBorderRadius
            }
          }
        }
        if (this.barMaxWidth !== 0) {
          serie.barMaxWidth = this.barMaxWidth
        } else {
          serie.barWidth = this.barWidth
        }
        option.series.push(serie)
      }
      this.chartdatas = datas
      this.option = option
      return option
    },
    defaultTooltipFormatter(params) {
      const label = params[0].name
      let tipArr = []
      let src = ''
      if (this.dataValueList.length > 1) {
        tipArr.push(label)
        params.forEach((item) => {
          const value = getValue(item.value, this.unitType)
          tipArr.push(`${item.marker}${item.seriesName}：${value}`)
        })
        tipArr = tipArr.filter((item) => {
          // 去掉总数背景的tip
          return item.indexOf('总数') === -1
        })
        src = tipArr.join('<br />')
      } else {
        const value = getValue(params[0].value, this.unitType)
        src = this.showName
          ? `${label}<br />${params[0].marker}${params[0].seriesName}：${value}`
          : `${label}<br />${value}`
      }
      return src
    },
    chartClick(params) {
      this.$emit('chartClick', params)
    }
  }
}
</script>
