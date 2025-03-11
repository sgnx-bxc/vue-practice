<template>
  <div class="breadcrumbBlock-page">
    <el-tag
      class="default-pagesign-style"
      v-for="(item, index) in cachedArrInfo"
      :key="index"
      :class="{ isActive: index === currentIndex }"
      :closable="index !== 0"
      @click="breadClick(item, index)"
      @close="breadClose(item, index)"
    >
      {{ item.meta.name }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'breadcrumbBlock',
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    cachedArrInfo() {
      return this.$store.getters['system/getCachedArrInfo']
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        this.routeChange(newVal)
      },
      immediate: true
    }
  },
  methods: {
    routeChange(newVal) {
      this.currentIndex = this.cachedArrInfo.findIndex(
        (item) => item.name === newVal.name
      )
    },
    breadClick(item, index) {
      this.currentIndex = index
      this.goRouter(item)
    },
    breadClose(routeInfo, index) {
      if (
        index < this.currentIndex ||
        (index === this.cachedArrInfo.length - 1 &&
          this.currentIndex === this.cachedArrInfo.length - 1)
      ) {
        this.currentIndex--
      }
      this.$store.dispatch('system/deleteKeepAlive', routeInfo)
      this.goRouter(this.cachedArrInfo[this.currentIndex])
    },
    goRouter(item) {
      if (item.name !== this.$route.name) {
        this.$router.push({
          path: item.path,
          query: item.query
        })
      }
    }
  }
}
</script>

<style lang="less">
.breadcrumbBlock-page {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  .default-pagesign-style {
    cursor: pointer;
    &.el-tag {
      position: relative;
      display: inline;
      line-height: 56px;
      padding: 0 20px;
      border-radius: 0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: transparent;
      border: 0 solid #000;
      color: #757575;
      font-size: 16px;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: 2px;
        height: 16px;
        transform: translateY(-50%) scaleX(0.5);
        background: #bdbdbd;
        overflow: hidden;
      }
      &:last-child::before {
        display: none;
      }
      &:hover {
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 15px);
          height: 32px;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          cursor: pointer;
        }
      }
      .el-tag__close {
        position: relative;
        font-size: 14px;
        color: #606266;
        transition: all 0.15s;
        width: 18px;
        height: 18px;
        line-height: 18px;
        z-index: 9;
        &:hover {
          background-color: #bdbdbd;
        }
      }
      &.isActive {
        color: #424242;
        font-family: 'Alibaba-PuHuiTi-Medium';
      }
    }
  }
}
</style>
