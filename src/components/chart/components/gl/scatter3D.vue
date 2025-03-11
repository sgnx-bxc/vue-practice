<template>
  <chartTool
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
  ></chartTool>
</template>
<script>
// 3d散点图
import chartTool from '@/components/chart/chartTool'
import 'echarts-gl'
export default {
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
      default: 'scatter3DChart'
    },
    // 图表数据
    datas: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    datas: {
      deep: true,
      handler() {
        this.initChart(this.datas)
      }
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
      let datas = ds
      const axis3D = {
        splitNumber: 3,
        nameTextStyle: {
          fontSize: 12
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 1
          }
        }
      }
      const option = {
        grid3D: {
          axisPointer: {
            show: false
          },
          viewControl: {
            distance: 200,
            alpha: 20,
            beta: 60
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(246, 250, 253, 1)', 'rgba(246, 250, 253, 1)']
            }
          }
        },
        xAxis3D: { ...axis3D, type: 'category' },
        yAxis3D: { ...axis3D },
        zAxis3D: { ...axis3D },
        series: [
          {
            type: 'scatter3D',
            symbolSize: 6,
            label: {
              show: false
            },
            data: datas
          }
        ]
      }
      this.chartdatas = datas
      this.option = option
      return option
    }
  }
}
</script>
