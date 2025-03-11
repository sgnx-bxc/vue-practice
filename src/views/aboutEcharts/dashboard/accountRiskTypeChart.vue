<template>
  <div class="accountRiskTypeChart-page">
    <chartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="accountRiskTypeChartRef"
      :option="optionData"
    ></chartTool>
  </div>
</template>

<script>
import { numberThousand } from '@/utils/dataFunction'

export default {
  name: 'accountRiskTypeChart',
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
            right: '7%',
            y: 'center',
            orient: 'vertical',
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 20,
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
              radius: ['50%', '80%'],
              center: ['37%', '50%'],
              avoidLabelOverlap: true,
              label: {
                formatter: `{d}%`,
                fontFamily: 'Alibaba-PuHuiTi-Regular'
              },
              data: data
            }
          ]
        }
      } else {
        const myChart = this.$refs.accountRiskTypeChartRef.getChartInstance()
        myChart.clear()
        this.nochartdatas = true
      }
    }
  }
}
</script>

<style lang="less">
.accountRiskTypeChart-page {
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
