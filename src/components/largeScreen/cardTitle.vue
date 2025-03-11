<template>
  <div class="cardTitle">
    <div
      class="title"
      :class="{ isCover: isCover }"
      :style="{ width: setWidth }"
    >
      <div :class="[direction ? 'headerRight' : 'headerLeft']">
        <img
          :src="
            require(`@/assets/img/daping/assetsSituation/${
              direction ? 'right_title' : 'left_title'
            }.${leftImg}`)
          "
          alt=""
        />
        <span class="line animationStyle it">{{ title }}</span>
      </div>
      <!-- <div class="headerRight" v-else>
        <img
          :src="
            require(`@/assets/img/daping/assetsSituation/right_title.${rightImg}`)
          "
          alt=""
        />
        <span class="line animationStyle it">{{ title }}</span>
      </div> -->
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
      timer: null,
      leftImg: 'webp',
      rightImg: 'webp'
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.timer = window.setInterval(() => {
      this.leftImg = this.leftImg === 'webp' ? 'png' : 'webp'
      this.rightImg = this.rightImg === 'webp' ? 'png' : 'webp'
    }, 5000)
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
  .title {
    height: 44px;
    position: relative;
    border-radius: 8px;
    .headerLeft {
      span {
        display: inline-block;
        box-sizing: border-box;
        font-family: 'Alibaba-PuHuiTi-Regular';
        font-size: 18px;
        color: #fff;
        line-height: 35px;
        letter-spacing: 0.68px;
        text-shadow: 0 0 4px #001526;
        font-weight: 400;
        position: absolute;
        top: 0px;
        left: 120px;
      }
    }
    .headerRight {
      span {
        display: inline-block;
        box-sizing: border-box;
        font-family: 'Alibaba-PuHuiTi-Regular';
        font-size: 18px;
        color: #fff;
        line-height: 35px;
        letter-spacing: 0.68px;
        text-shadow: 0 0 4px #001526;
        font-weight: 400;
        // text-align: center;
        position: absolute;
        top: 0px;
        left: 60px;
      }
    }
    .line {
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      border-right: 2px solid #000;
    }
    .animationStyle {
      animation: grow 2s steps(70) 1s normal both, blink 200ms infinite normal;
    }
    .it {
      animation-delay: 0.5s;
    }
    @keyframes grow {
      from {
        width: 0;
      }
      to {
        width: 100%;
        border-right-color: transparent;
      }
      0% {
        border-right: 0;
      }
      1% {
        // border-right: 2px solid #000;
      }
      99% {
        // border-right: 2px solid #000;
      }
      100% {
        border-right: 0;
      }
    }
    @keyframes blink {
      from {
        border-right-color: #000;
      }
      to {
        border-right-color: transparent;
      }
    }
  }
  .isCover {
    width: 100%;
    span {
      // width: calc(100% - 50px);
      width: 100%;
    }
  }
}
</style>
