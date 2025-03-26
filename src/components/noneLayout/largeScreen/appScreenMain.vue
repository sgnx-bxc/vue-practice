<template>
  <div class="appScreenMain-page" id="edr-largeScreen">
    <headerBlock></headerBlock>
    <transition
      :name="flag === 0 ? 'layout-fade-left' : 'layout-fade-right'"
      mode="out-in"
    >
      <router-view class="largeScreen-main"></router-view>
    </transition>
    <div class="left-prev" @click="prev"></div>
    <div class="right-next" @click="next"></div>
  </div>
</template>

<script>
import headerBlock from './components/headerBlock.vue'
import largeScreen from '@/utils/mixins/largeScreen'

export default {
  name: 'appScreenMain',
  mixins: [largeScreen],
  components: { headerBlock },
  data() {
    return {
      noneLayoutPageRoutes:
        this.$store.getters['system/getNoneLayoutPageRoutes'],
      largeScreenRoutes: [],
      currentRouteIndex: 0,
      flag: 0 // 路由切换动画：0-左滑，1-右滑
    }
  },
  mounted() {
    this.initLargeScreen()
  },
  methods: {
    initLargeScreen() {
      this.largeScreenRoutes = this.noneLayoutPageRoutes.filter(
        (item) => item.meta.type === 'largeScreen'
      )
      this.currentRouteIndex = this.largeScreenRoutes.findIndex(
        (item) => item.path === this.$route.path
      )
    },
    prev() {
      this.flag = 0
      if (this.currentRouteIndex === 0) {
        this.currentRouteIndex = this.largeScreenRoutes.length - 1
      } else {
        this.currentRouteIndex--
      }
      this.goRoute()
    },
    next() {
      this.flag = 1
      if (this.currentRouteIndex === this.largeScreenRoutes.length - 1) {
        this.currentRouteIndex = 0
      } else {
        this.currentRouteIndex++
      }
      this.goRoute()
    },
    goRoute() {
      this.$router.push({
        path: this.largeScreenRoutes[this.currentRouteIndex].path
      })
    }
  }
}
</script>

<style lang="less">
#edr-largeScreen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0px 0px;
  background-color: #000;
  color: #fff;
  .largeScreen-main {
    width: 100%;
    height: calc(100% - 66px);
    overflow: hidden;
  }
  .left-prev {
    position: absolute;
    width: 34px;
    height: 48px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: url('~@/assets/img/largeScreen/left_prev.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .left-prev:hover {
    background: url('~@/assets/img/largeScreen/left_prev_hover.png') no-repeat;
    background-size: 100% 100%;
  }
  .right-next {
    position: absolute;
    width: 34px;
    height: 48px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: url('~@/assets/img/largeScreen/right_next.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .right-next:hover {
    background: url('~@/assets/img/largeScreen/right_next_hover.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
