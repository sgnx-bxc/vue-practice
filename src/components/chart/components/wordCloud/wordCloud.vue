<template>
  <chartTool
    :id="charId"
    :option="option"
    :class="{ 'ismc-nonedata': chartdatas.length == 0 }"
    :isSVGRender="isSVGRender"
  ></chartTool>
</template>

<script>
// 词云
import chartTool from '@/components/chart/chartTool'
export default {
  name: 'wordCloud',
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
      default: 'wordChart'
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
    /* 图表参数 */
    // 文字颜色
    wordColors: {
      type: Array,
      default: () => [
        '#5191FF',
        '#AA6DFF',
        '#21AEF2',
        '#FF79F6',
        '#55E3A2',
        '#F0B585'
      ]
    }
  },
  mounted() {
    this.initChart(this.datas)
  },
  methods: {
    initChart(ds = []) {
      if (ds.length === 0) {
        return {}
      }
      const self = this
      let datas = ds
      datas = datas.map(item => {
        const obj = {
          name: item[self.dataKey],
          value: item[self.dataValue]
        }
        return obj
      })
      // 设置图表option
      const option = {
        tooltip: {},
        series: [
          {
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            // width: '70%',
            // height: '80%',
            right: null,
            bottom: null,
            sizeRange: [14, 28],
            rotationRange: [0, 0],
            // rotationStep: 45,
            gridSize: 15,
            drawOutOfBound: false,
            layoutAnimation: true,
            textStyle: {
              color: function(params) {
                const index = params.dataIndex % self.wordColors.length
                return self.wordColors[index]
              }
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
