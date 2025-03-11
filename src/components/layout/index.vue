<template>
  <div class="salaxy-layout">
    <!-- 头部 -->
    <div class="salaxy-header">
      <HeaderBlock></HeaderBlock>
    </div>
    <div class="salaxy-content-panel">
      <!-- 左边栏 -->
      <div class="layout-nav" :class="{ 'layout-nav-collapse': isCollapse }">
        <!-- 菜单 -->
        <SideBar class="nav-block-new" :isCollapse="isCollapse"></SideBar>
        <!-- 产品标题 -->
        <div class="div-title">
          <div
            class="btn-collapse"
            @click="changeCollapse"
            :title="collapseTitle"
          ></div>
        </div>
        <!-- 菜单背景 -->
        <div class="menu-bg"></div>
      </div>
      <!-- 右边主体 -->
      <section
        class="layout-section"
        :class="{
          'layout-nav-collapse': isCollapse
        }"
      >
        <!-- 面包屑路径 -->
        <BreadcrumbBlock></BreadcrumbBlock>
        <!-- 菜单路由页面 -->
        <div
          v-loading="isLoading"
          class="router-view-content routerViewContentNo"
        >
          <transition name="fade-transform" mode="out-in">
            <EmptyLayout v-if="isRouterAlive"></EmptyLayout>
          </transition>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import HeaderBlock from '@/components/layout/components/headerBlock'
import BreadcrumbBlock from '@/components/layout/components/breadcrumbBlock'
import SideBar from '@/components/layout/components/sideBar/sideBar'
import EmptyLayout from '@/components/layout/emptyLayout'

export default {
  name: 'layout',
  components: {
    HeaderBlock,
    BreadcrumbBlock,
    SideBar,
    EmptyLayout
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  computed: {
    isCollapse() {
      return this.$store.getters['system/getIsCollapse']
    },
    isLoading() {
      return this.$store.getters['table/getIsLoading']
    },
    collapseTitle() {
      if (this.isCollapse) {
        return '展开'
      } else {
        return '收起'
      }
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  mounted() {
    this.pageResize()
    window.addEventListener('resize', this.pageResize)
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    pageResize() {
      const sw =
        document.documentElement.clientWidth || document.body.clientWidth
      if (sw <= 1600) {
        // 收起菜单
        this.$store.commit('system/setIsCollapse', true)
      }
    },
    // 菜单收缩
    changeCollapse() {
      this.$store.commit('system/setIsCollapse', !this.isCollapse)
    }
  }
}
</script>

<style lang="less">
.salaxy-layout {
  @left-width: 224px;
  @left-collapse-width: 56px;
  @title-height: 55px;
  position: relative;
  background: #e1e4f0;
  width: 100%;
  height: 100%;
  .salaxy-header {
    width: 100%;
    height: 56px;
    background: linear-gradient(90deg, #5370c4, #1a364e);
    box-shadow: 4px 0 11px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 9;
    .backhome-panel {
      display: flex;
      align-items: center;
      cursor: pointer;
      .backhome-icon {
        width: 20px;
        height: 20px;
        background: url('~@/assets/img/common/backhome.png');
        background-size: 100%;
      }
      .backhome-text {
        width: 80px;
        font-size: 18px;
        color: #fff;
        margin-left: 10px;
      }
    }
  }
  .salaxy-content-panel {
    width: 100%;
    height: calc(100% - 56px);
    position: relative;
    /** 菜单样式 **/
    .layout-nav {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100%;
      width: @left-width;
      box-shadow: 4px 0 11px 0 rgba(0, 0, 0, 0.39);
      background: url('~@/assets/img/layout/menu-bottom.png') no-repeat bottom,
        linear-gradient(193deg, #5773c9 0%, #3a5da3 100%);
      z-index: 2;
      // 标题样式
      .div-title {
        width: 100%;
        height: @title-height;
        position: relative;
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn-collapse {
          width: 26px;
          height: 16px;
          background: url('~@/assets/img/layout/menu.png') center no-repeat;
          left: calc(@left-width + 20px);
          transform: rotateZ(180deg);
          top: 18px;
          cursor: pointer;
          z-index: 1;
          &::after {
            content: '';
            position: absolute;
            height: 15px;
            width: 1px;
            background: #aab2c0;
            right: 50px;
          }
        }
      }
      // 收起时样式
      &.layout-nav-collapse {
        width: @left-collapse-width;
        .btn-collapse {
          transform: rotateZ(0deg);
          left: 84px;
          &::after {
            right: -20px;
          }
        }
      }
      // 菜单样式
      .nav-block-new {
        width: 100%;
        height: calc(100% - @title-height);
      }
    }
    /* 页面主体样式 */
    .layout-section {
      position: absolute;
      right: 0;
      bottom: 0;
      width: calc(100% - @left-width);
      height: 100%;
      overflow: hidden;
      &.layout-nav-collapse {
        width: calc(100% - @left-collapse-width);
      }
      &.full-screen {
        width: 100%;
        height: 100%;
      }
      .router-view-content {
        margin: 0 20px;
        width: calc(100% - 40px);
        height: calc(100% - 52px - 20px);
        &.full-screen {
          margin: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
