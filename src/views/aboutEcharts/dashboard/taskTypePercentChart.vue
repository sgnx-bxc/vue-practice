<template>
  <div class="taskTypePercentChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="taskTypePercentChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { numberThousand } from '@/utils/dataFunction'

export default {
  name: 'taskTypePercentChart',
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
                  <span class="valueLine">|</span>
                  <span>${params.percent}%</span>
                </div>
              </div>
            `
              return toolTip
            }
          },
          legend: {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 20,
            type: 'scroll',
            textStyle: {
              fontFamily: 'Alibaba-PuHuiTi-Regular',
              fontSize: 14,
              color: '#2d2f33'
            }
          },
          series: [
            {
              color: ['#a3c0ff', '#5191ff', '#6ed5e7'],
              type: 'pie',
              radius: ['0', '70%'],
              center: ['50%', '48%'],
              avoidLabelOverlap: true,
              labelLine: {
                length: 2
              },
              label: {
                formatter: `{d}%`,
                fontFamily: 'Alibaba-PuHuiTi-Regular'
              },
              data: data
            }
          ]
        }
      } else {
        const myChart = this.$refs.taskTypePercentChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.taskTypePercentChart-page {
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
      .valueLine {
        vertical-align: text-bottom;
      }
    }
  }
}
</style>
