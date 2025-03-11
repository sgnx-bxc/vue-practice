<template>
  <div class="riskAssetChart-page">
    <div class="bar-box riskAssetBaxClass" v-if="resetContent">
      <div
        v-for="(item, index) in dataInfo"
        :key="index"
        class="bar-row riskAssetRowClass"
      >
        <div class="top">
          <div class="top-name">
            <div class="name-label" :title="item.name || '--'">
              {{ item.name || '--' }}
            </div>
          </div>
          <div class="top-value">
            <span class="value-text">存在风险数：</span>
            <span class="value-count" :title="item.value | numFilter">{{
              item.value | numFilter
            }}</span>
          </div>
        </div>
        <div class="content">
          <div
            class="content-active"
            :style="{ width: total ? (item.value / total) * 100 + '%' || 0 : 0 }"
          ></div>
        </div>
      </div>
    </div>
    <div
      v-if="nochartdatas"
      :class="{ 'edr-nonechartdata': dataInfo.length === 0 }"
      class="noDataClass"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'riskAssetChart',
  data() {
    return {
      dataInfo: [],
      total: 0,
      nochartdatas: true,
      resetContent: true
    }
  },
  filters: {
    numFilter(val) {
      let result = '--'
      if (val || val === 0) {
        result = parseInt(val).toLocaleString()
      }
      return result
    }
  },
  mounted() {
    window.addEventListener('resize', this.rowMarginTop)
  },
  methods: {
    rowMarginTop() {
      const dom1 = document.querySelector('.riskAssetBaxClass')
      const dom2 = document.querySelectorAll('.riskAssetRowClass')
      if (dom1 && dom2) {
        dom2.forEach((item, index) => {
          if (index > 0) {
            item.style.marginTop = (dom1.clientHeight - 150) / 4 + 'px'
          }
        })
      }
    },
    initCharts(data) {
      this.dataInfo = new Array(data.length).fill({ value: 0 })
      this.resetContent = false
      this.$nextTick(() => {
        this.resetContent = true
        setTimeout(() => {
          this.dataInfo = data
          if (this.dataInfo.length > 0) {
            this.nochartdatas = false
            this.total = this.dataInfo[0].value
          } else {
            this.nochartdatas = true
            this.dataInfo = []
            this.total = 0
          }
          this.rowMarginTop()
        }, 30)
      })
    }
  }
}
</script>

<style lang="less">
.riskAssetChart-page {
  position: relative;
  width: 100%;
  height: 100%;
  .bar-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .bar-row {
      width: 100%;
      height: 30px;
      margin-top: calc((214px - 150px) / 4);
      &:first-child {
        margin-top: 0;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .top-name {
          max-width: 55%;
          color: #2d2f33;
          line-height: 18px;
          .name-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .top-value {
          max-width: calc(45% - 20px);
          min-width: 94px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .value-text {
            font-size: 12px;
            color: #878d99;
          }
          .value-count {
            font-size: 16px;
            font-family: 'DIN-Alternate-Bold';
            color: #2d2f33;
          }
        }
      }
      .content {
        width: 100%;
        height: 8px;
        background: #e5effa;
        border-radius: 4px;
        overflow: hidden;
        .content-active {
          width: 0;
          height: 100%;
          background: linear-gradient(270deg, #5191ff 1%, #81d2e0);
          transition: width 1s;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            opacity: 0.85;
          }
        }
      }
    }
  }
  .noDataClass {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
