<template>
  <div class="soapContainChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="soapContainChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { numberThousand } from '@/utils/dataFunction'
export default {
  name: 'soapContainChart',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nochartdatas: true,
      optionData: {}
    }
  },
  methods: {
    initCharts(data) {
      if (data && data.length > 0) {
        this.nochartdatas = false
        this.optionData = {
          tooltip: {
            show: true,
            confine: true,
            trigger: 'item',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            formatter: function (params) {
              const toolTip = `
              <div class="tool-name">
                <div class="circle" style="background-color: ${params.color}"></div>
                <div class="name-tool">${params.data.name}</div>
                <div class="name-value">
                  <span>${numberThousand(params.data.value)}</span>
                </div>
              </div>
            `
              return toolTip
            }
          },
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            containLabel: true
          },
          series: [
            {
              type: 'wordCloud',
              gridSize: 15, // 控制词云图的网格大小，值越大词语之间的间距越大
              sizeRange: [14, 36], // 控制词语的大小范围
              rotationRange: [0, 90], // 控制词语的旋转角度范围
              rotationStep: 10, // 控制词语旋转的步长
              shape: 'circle', // 控制词云图的形状，可选值为 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
              drawOutOfBound: false, // 控制词云图是否允许词语超出绘制区域
              // 布局的时候是否有动画
              layoutAnimation: true,
              left: 'center',
              top: 'center',
              textStyle: {
                fontFamily: 'Alibaba-PuHuiTi-Regular',
                color: () => {
                  return (
                    'rgb(' +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(',') +
                    ')'
                  )
                }
              },
              data: data
            }
          ]
        }
      } else {
        const myChart = this.$refs.soapContainChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.soapContainChart-page {
  width: 100%;
  height: 100%;
  .tool-name {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #d9dfea;
    border-radius: 2px;
    box-shadow: 0px 4px 12px 0px rgba(14, 41, 109, 0.1);
    font-family: 'Alibaba-PuHuiTi-Regular';
    padding: 5px 10px;
    .circle {
      width: 8px;
      height: 8px;
      background: #2985f7;
      border-radius: 50%;
    }
    .name-tool {
      margin-left: 8px;
      margin-right: 20px;
    }
    .name-value {
      font-family: 'Alibaba-PuHuiTi-Medium';
    }
  }
}
</style>
