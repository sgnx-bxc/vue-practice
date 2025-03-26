<template>
  <div class="cardTitle">
    <div
      class="title"
      :class="{ isCover: isCover }"
      :style="{ width: setWidth }"
    >
      <div :class="[direction ? 'headerRight' : 'headerLeft']">
        <img
          :src="`${require(`@/assets/img/largeScreen/${
            direction ? 'right_title' : 'left_title'
          }.${leftImg}`)}?timestamp=${new Date().getTime()}`"
          loop
          alt=""
        />
        <span class="animationStyle it">{{ title }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cardTitle',
  props: {
    // 组件的title
    title: {
      type: String,
      default: ''
    },
    // 宽度是否为cover
    isCover: {
      type: Boolean,
      default: true
    },
    // 设置宽度百分比
    setWidth: {
      type: String,
      default: ''
    },
    // 位置：左右，左边为false,右边为true
    direction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      leftImg: 'webp',
      rightImg: 'webp',
      keyChange: new Date().getTime()
    }
  },
  watch: {
    $route: {
      handler() {
        this.keyChange = new Date().getTime()
      }
    }
  }
}
</script>
<style lang="less">
.cardTitle {
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .title {
    height: 44px;
    position: relative;
    border-radius: 8px;
    .headerLeft {
      span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        font-size: 18px;
        line-height: 35px;
        position: absolute;
        top: 0px;
        left: 120px;
      }
    }
    .headerRight {
      text-align: right;
      span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        font-size: 18px;
        line-height: 35px;
        position: absolute;
        top: 0px;
        right: 120px;
      }
    }
    .animationStyle {
      animation: grow 2s steps(70) 1s normal both;
    }
    @keyframes grow {
      from {
        width: 0;
      }
      to {
        width: 100%;
      }
    }
  }
  .isCover {
    width: 100%;
  }
}
</style>
