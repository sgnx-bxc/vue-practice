<template>
  <div :id="id" class="salaxy-chart" v-show="showChart"></div>
</template>

<script>
export default {
  name: 'chartTool',
  data() {
    return {
      showChart: true,
      chartInstance: null,
      // 图表默认配置
      defaultOption: {}
    }
  },
  props: {
    // 图表的id
    id: {
      type: String,
      required: true,
      default: 'salaxy-chart'
    },
    // 图表的echarts配置
    option: {
      type: Object,
      required: true,
      default: () => ({})
    },
    // 图表是否使用默认配置
    useDefaultOption: {
      type: Boolean,
      default: true
    },
    // 是否绑定点击事件
    isBindClick: {
      type: Boolean,
      default: false
    },
    // 是否使用svg渲染，默认canvas
    isSVGRender: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isCollapse() {
      return this.$store.getters['system/getIsCollapse']
    }
  },
  watch: {
    option: {
      handler(newValue) {
        this.initChart(newValue)
      },
      deep: true
    },
    isCollapse() {
      this.resizeChart()
    },
    $route() {
      this.resizeChart()
    }
  },
  mounted() {
    this.initChart(this.option)
    this.initClickBind()
    window.addEventListener('resize', this.resizeChart)
    this.$bus.$on('resizeChart', this.resizeChart)
  },
  activated() {
    window.addEventListener('resize', this.resizeChart)
    this.$bus.$on('resizeChart', this.resizeChart)
  },
  beforeDestroy() {
    this.$bus.$off('resizeChart')
    if (this.chartInstance !== null) {
      window.removeEventListener('resize', this.resizeChart)
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },
  methods: {
    initChart(option) {
      this.showChart = true
      if (!this.chartInstance) {
        const myBar = document.getElementById(this.id)
        if (this.isSVGRender) {
          this.chartInstance = this.$echarts.init(myBar, null, {
            renderer: 'svg'
          })
        } else {
          this.chartInstance = this.$echarts.init(myBar, null, {
            devicePixelRatio: window.devicePixelRatio * 2 || 1
          })
        }
      } else {
        this.chartInstance.clear()
      }
      this.resizeChart()
      if (Object.keys(option).length === 0) {
        // 如果配置项为空，则清除chart
        this.chartInstance.clear()
      } else {
        this.chartInstance.setOption(this.optionsCombineFunc(option))
      }
    },
    optionsCombineFunc(option) {
      let newOption = option
      if (this.useDefaultOption) {
        newOption = this.deepObjectMerge(this.defaultOption, option)
      }
      return newOption
    },
    // 进行 option 的覆盖式合并，有就覆盖，没有就进行追加
    deepObjectMerge(firstObj, secondObj) {
      const self = this
      // 深度合并对象
      for (let key in secondObj) {
        firstObj[key] =
          firstObj[key] && firstObj[key].toString() === '[object Object]'
            ? self.deepObjectMerge(firstObj[key], secondObj[key])
            : (firstObj[key] = secondObj[key])
      }
      return firstObj
    },
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },
    hideChart() {
      this.showChart = false
    },
    initClickBind() {
      const self = this
      if (this.isBindClick) {
        this.chartInstance.on('click', function (params) {
          self.$emit('chartClick', params)
        })
      }
    },
    getChartInstance() {
      return this.chartInstance
    }
  }
}
</script>

<style lang="less" scoped>
.salaxy-chart {
  height: 100%;
  width: 100%;
}
</style>
