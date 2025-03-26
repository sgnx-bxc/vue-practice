<template>
  <div
    class="screenHeaderBlock-page"
    :style="{
      background: `url(${require('@/assets/img/largeScreen/header.webp')}?timestamp=${keyChange}) no-repeat`,
      backgroundSize: '100% 100%'
    }"
  >
    <div class="title">{{ routeName }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyChange: new Date().getTime()
    }
  },
  computed: {
    // 当前路由页面名称
    routeName() {
      return this.$route.meta.name
    }
  },
  watch: {
    $route: {
      handler() {
        console.log('-')
        this.keyChange = new Date().getTime()
      }
    }
  }
}
</script>

<style lang="less">
.screenHeaderBlock-page {
  width: 100%;
  height: 66px;
  position: relative;
  .title {
    height: 66px;
    line-height: 66px;
    font-size: 24px;
    color: #bffff0;
    letter-spacing: 5.54px;
    text-align: center;
    font-family: 'Alibaba-PuHuiTi-Bold';
  }
}
</style>
