<template>
  <div :id="id" class="salaxy-g6ChartTool" v-show="showChart"></div>
</template>

<script>
export default {
  name: 'g6ChartTool',
  data() {
    return {
      showChart: true
    }
  },
  props: {
    // 图表的id
    id: {
      type: String,
      required: true,
      default: 'salaxy-chart'
    },
    // 图表
    graph: {
      type: [Object, null],
      required: false,
      default: null
    }
  },
  computed: {
    isCollapse() {
      return this.$store.getters['system/getIsCollapse']
    }
  },
  watch: {
    isCollapse() {
      this.resizeChart()
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.$bus.$on('resizeChart', this.resizeChart)
  },
  activated() {
    window.addEventListener('resize', this.resizeChart)
    this.$bus.$on('resizeChart', this.resizeChart)
  },
  beforeDestroy() {
    this.$bus.$off('resizeChart')
    window.removeEventListener('resize', this.resizeChart)
    if (this.graph) {
      this.graph.destroy()
    }
  },
  methods: {
    hideChart() {
      this.showChart = false
    },
    resizeChart() {
      if (this.graph) {
        const newWidth = document.getElementById(this.id).clientWidth
        const newHeight = document.getElementById(this.id).clientHeight
        this.graph.changeSize(newWidth, newHeight)
        this.graph.fitView()
      }
    }
  }
}
</script>

<style>
.salaxy-g6ChartTool {
  height: 100%;
  width: 100%;
}
</style>
