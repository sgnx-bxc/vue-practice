<template>
  <chartTool
    ref="chartToolRef"
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
    :isSVGRender="isSVGRender"
  ></chartTool>
</template>

<script>
import tooltipMixin from '@/components/chart/tooltipMixin'
// 线图
import chartTool from '@/components/chart/chartTool'
import { getLimitLenString } from '@/utils/strUtils'
import { getValue } from '@/utils/convertCount'
export default {
  name: 'lineChart',
  mixins: [tooltipMixin],
  components: { chartTool },
  data() {
    return {
      // 配置项
      option: {},
      chartdatas: [],
      endTime: {}
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
      default: 'lineChart'
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
    /* 图表参数 */
    // 是否为面积图
    isArea: {
      type: Boolean,
      default: false
    },
    // 是否显示legend
    showlengend: {
      type: Boolean,
      default: true
    },
    // 是否现在Y轴label
    showYaxisLabel: {
      type: Boolean,
      default: true
    },
    // 是否现在X轴label
    showXaxisLabel: {
      type: Boolean,
      default: false
    },
    // X轴label文本长度
    xLimitLen: {
      type: Number,
      default: 6
    },
    // 是否显示滚动条
    showDataZoom: {
      type: Boolean,
      default: false
    },
    // 滚动条显示的初始化条数
    dataZoomLen: {
      type: Number,
      default: 5
    },
    // 线是否是曲线
    isSmooth: {
      type: Boolean,
      default: false
    },
    // 数据是否排序
    isSort: {
      type: Boolean,
      default: false
    },
    // 坐标系参数
    grid: {
      type: Object,
      default: () => {
        return {
          top: '70',
          left: '30',
          right: '30',
          bottom: '25',
          containLabel: true
        }
      }
    },
    // 自定义tooltip格式的方法
    tooltipFormatter: {
      type: Function,
      default: null
    },
    // 是否展示toolTip为起始和截止时间
    showEndTime: {
      type: Boolean,
      default: false
    },
    // 是否显示图中圆点
    showCircle: {
      type: Boolean,
      default: false
    },
    // tooltip配置
    tooltips: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // x轴坐标系name
    xAxisName: {
      type: String,
      default: ''
    },
    // y轴坐标系name
    yAxisName: {
      type: String,
      default: ''
    },
    // 垂直柱状图的x轴标签样式
    VxAxisAxisLabel: {
      type: Object,
      default: null
    },
    splitShow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // legend距离上面的距离
    legendTop: {
      type: Number,
      default: 20
    },
    // x轴label颜色
    xAxisColor: {
      type: String,
      default: '#666'
    },
    // 图例颜色
    legendColor: {
      type: String,
      default: '#666'
    }
  },
  mounted() {
    this.initChart(this.datas)
  },
  beforeDestroy() {},
  methods: {
    initChart(ds = [], endTime = {}) {
      const self = this
      if (ds.length === 0) {
        this.option = {}
        this.chartdatas = []
        return {}
      }
      this.endTime = endTime
      let datas = ds
      // 每项求和
      const sumMap = {}
      datas.forEach(item => {
        let sum = 0
        self.dataValueList.forEach(xKeyObj => {
          sum += parseFloat(item[xKeyObj.key] || 0)
        })
        item.sum = sum
        sumMap[item[self.dataKey] || ''] = sum
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
      // 处理图表数据
      const series = []
      const legend = new Set()
      const datasY = []
      const datasX = new Array(this.dataValueList.length).fill()
      datas.forEach(item => {
        datasY.push(item[self.dataKey] || '')
        self.dataValueList.forEach((xKeyObj, index) => {
          if (!datasX[index]) {
            datasX[index] = []
          }
          datasX[index].push(parseFloat(item[xKeyObj.key] || 0))
          legend.add(xKeyObj.name)
        })
      })
      const dataZoomEnd =
        datasY.length <= this.dataZoomLen
          ? 100
          : (this.dataZoomLen / datasY.length) * 100

      let VxAxisAxisLabel = {
        show: this.showXaxisLabel,
        // interval: 0, // 显示所有X轴label
        // rotate: 25,
        color: this.xAxisColor,
        textStyle: {
          fontSize: 12
        },
        formatter: name => {
          return getLimitLenString(name, self.xLimitLen)
        }
      }
      if (this.VxAxisAxisLabel !== null) {
        VxAxisAxisLabel = this.VxAxisAxisLabel
      }
      const lineOption = {
        xAxis: {
          name: this.xAxisName,
          nameTextStyle: {
            color: '#9DAAAD',
            fontSize: 14,
            verticalAlign: 'top',
            padding: [6, 0, 0, -10],
            fontWeight: 400
          },
          boundaryGap: true,
          axisLabel: VxAxisAxisLabel,
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.15)',
              width: 1
            }
          },
          data: datasY
        },
        yAxis: {
          name: this.yAxisName,
          nameTextStyle: {
            color: '#9DAAAD',
            fontSize: 14,
            align: 'right',
            padding: [0, 8, 15, 0],
            fontWeight: 400
          },
          splitNumber: 3,
          axisLabel: {
            show: this.showYaxisLabel,
            color: '#cbcbcb',
            textStyle: {
              fontSize: 12
            },
            formatter: function(name) {
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
      // 处理线形series数据
      const symbolSize =
        datasY.length === 1 ? 5 : this.showCircle === true ? 4 : 0
      datasX.forEach((data, index) => {
        const xKeyObj = self.dataValueList[index]
        const serie = {
          name: xKeyObj.name,
          zlevel: 1,
          type: 'line',
          smooth: this.isSmooth,
          symbolSize: symbolSize,
          itemStyle: {
            normal: {
              color: xKeyObj.color
            }
          },
          lineStyle: {
            normal: {
              color: xKeyObj.color
            }
          },
          label: {
            show: false
          },
          data: data
        }
        if (self.isArea) {
          serie.areaStyle = {
            // 区域填充样式
            normal: {
              color: xKeyObj.areaColor
            }
          }
        }
        series.push(serie)
      })
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
          formatter: tooltipformat
        },
        grid: this.grid,
        legend: {
          show: this.showlengend,
          data: [...legend],
          top: this.legendTop,
          right: 30,
          icon: 'rec',
          itemWidth: 12,
          itemHeight: 6,
          itemGap: 12,
          textStyle: {
            color: this.legendColor
          }
        },
        xAxis: lineOption.xAxis,
        yAxis: lineOption.yAxis,
        series: series
      }
      if (this.showDataZoom) {
        option.dataZoom = lineOption.dataZoom
      }
      this.chartdatas = datas
      this.option = option
      return option
    },
    defaultTooltipFormatter(params) {
      const label = params[0].name
      let tipArr = []
      if (this.showEndTime) {
        tipArr.push(`起始：${label}`)
        tipArr.push(`截止：${this.endTime[label]}`)
      } else {
        tipArr.push(label)
      }
      params.forEach(item => {
        const value = getValue(item.value, this.unitType)
        tipArr.push(`${item.marker}${item.seriesName}：${value}`)
      })
      const src = tipArr.join('<br />')
      return src
    }
  }
}
</script>
