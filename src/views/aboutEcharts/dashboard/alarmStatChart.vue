<template>
  <div class="alarmChart-page">
    <chartTool
      :id="id"
      :option="optionData"
      ref="alarmStatisticRef"
    ></chartTool>
    <div class="chart-value" :title="alarmBarData.count | numFilter">
      {{ alarmBarData.count | numFilter }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'alarmChart',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      optionData: {},
      alarmBarData: {}
    }
  },
  filters: {
    numFilter(res) {
      let result = '--'
      if (res || res === 0) {
        result = parseInt(res).toLocaleString()
      }
      return result
    }
  },
  mounted() {},
  methods: {
    initCharts(data) {
      this.alarmBarData = data
      this.optionData = {
        angleAxis: {
          max: this.alarmBarData.total, // 满分
          clockwise: true, // 逆时针
          // 隐藏刻度线
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          // 隐藏刻度线
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        polar: {
          center: ['50%', '46%'],
          radius: '120%' // 图形大小
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                name: '高危告警',
                value: this.alarmBarData.count,
                itemStyle: {
                  normal: {
                    color: this.alarmBarData.color
                  }
                }
              }
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 2
          },
          {
            // 灰色环
            type: 'bar',
            data: [
              {
                value: this.alarmBarData.total,
                itemStyle: {
                  color: '#eff2f7'
                }
              }
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 1
          }
        ]
      }
    }
  }
}
</script>

<style lang="less">
.alarmChart-page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .chart-value {
    max-width: 79px;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 22px;
    font-family: 'DIN-Alternate-Bold';
    color: #0e1011;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
