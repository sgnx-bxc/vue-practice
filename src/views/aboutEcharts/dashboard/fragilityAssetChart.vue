<template>
  <div class="fragilityAssetChart-page">
    <div class="bar-box fragilityAssetBoxClass" v-if="resetContent">
      <div
        v-for="(item, index) in dataInfo"
        :key="index"
        class="bar-row fragilityAssetRowClass"
      >
        <div class="left" :class="`left${index}`"></div>
        <div class="content">
          <div class="content-top">
            <div class="top-left" :title="item.agentName || '--'">
              {{ item.agentName || '--' }}
            </div>
            <div class="top-right" :title="item.osType || '--'">
              {{ item.osType || '--' }}
            </div>
          </div>
          <div class="content-bottom">
            <div
              class="content-active"
              :style="{ width: total ? (item.count / total) * 100 + '%' || 0 : 0 }"
            ></div>
          </div>
        </div>
        <div class="right">
          <div class="right-value" :title="item.count | numFilter">
            {{ item.count | numFilter }}
          </div>
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
  name: 'fragilityAssetChart',
  data() {
    return {
      dataInfo: [],
      total: 0,
      nochartdatas: true,
      resetContent: true
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
  mounted() {
    window.addEventListener('resize', this.rowMarginTop)
  },
  methods: {
    rowMarginTop() {
      const dom1 = document.querySelector('.fragilityAssetBoxClass')
      const dom2 = document.querySelectorAll('.fragilityAssetRowClass')
      if (dom1 && dom2) {
        dom2.forEach((item, index) => {
          if (index > 0) {
            item.style.marginTop = (dom1.clientHeight - 160) / 4 + 'px'
          }
        })
      }
    },
    initCharts(data) {
      this.dataInfo = new Array(data.length).fill({ count: 0 })
      this.resetContent = false
      this.$nextTick(() => {
        this.resetContent = true
        setTimeout(() => {
          this.dataInfo = data
          if (this.dataInfo.length > 0) {
            this.nochartdatas = false
            this.total = this.dataInfo[0].count
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
.fragilityAssetChart-page {
  position: relative;
  width: 100%;
  height: 100%;
  .bar-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .bar-row {
      display: flex;
      align-items: center;
      height: 32px;
      margin-top: calc((214px - 160px) / 4);
      &:first-child {
        margin-top: 0;
      }
      .left {
        width: 29px;
        height: 20px;
        &.left0 {
          background: url('~@/assets/img/aboutEcharts/1.png') no-repeat;
          background-size: 100%;
        }
        &.left1 {
          background: url('~@/assets/img/aboutEcharts/2.png') no-repeat;
          background-size: 100%;
        }
        &.left2 {
          background: url('~@/assets/img/aboutEcharts/3.png') no-repeat;
          background-size: 100%;
        }
        &.left3 {
          background: url('~@/assets/img/aboutEcharts/4.png') no-repeat;
          background-size: 100%;
        }
        &.left4 {
          background: url('~@/assets/img/aboutEcharts/5.png') no-repeat;
          background-size: 100%;
        }
      }
      .content {
        margin-left: 12px;
        width: calc(100% - 86px);
        height: 100%;
        .content-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 22px;
          line-height: 22px;
          .top-left {
            max-width: calc(50% - 20px);
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .top-right {
            max-width: 50%;
            font-size: 12px;
            color: #878d99;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .content-bottom {
          width: 100%;
          height: 10px;
          margin-top: 1px;
          background-color: #e5effa;
          .content-active {
            width: 0;
            height: 100%;
            background: linear-gradient(270deg, #ff5249 1%, #ff7b74);
            transition: width 1s;
            cursor: pointer;
            &:hover {
              opacity: 0.85;
            }
          }
        }
      }
      .right {
        display: flex;
        margin-left: 5px;
        width: 40px;
        .right-value {
          max-width: 100%;
          font-size: 16px;
          font-family: 'DIN-Alternate-Bold';
          text-align: left;
          color: #2d2f33;
          margin-top: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
