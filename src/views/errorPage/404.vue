<template>
  <div class="page404">
    <div class="wscn-http">
      <div class="bullshit">
        <div class="bullshit__oops">404</div>
        <div class="bullshit__headline">Not found</div>
        <div class="bullshit__info">
          请检查您输入的网址是否正确，或者点击下面的按钮返回上一页。
        </div>
        <div class="bullshit__return-home" @click="back">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page404',
  methods: {
    back() {
      let from = this.$route.query.from
      if (!from) {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: from })
      }
    }
  }
}
</script>

<style lang="less">
.page404 {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
  .wscn-http {
    position: relative;
    width: 1200px;
    padding: 0 50px;
    overflow: hidden;
    .bullshit {
      position: relative;
      float: left;
      width: 300px;
      padding: 30px 0;
      overflow: hidden;
      &__oops {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      &__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }
      &__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }
      &__return-home {
        display: block;
        float: left;
        width: 70px;
        height: 36px;
        background: #1482f0;
        border-radius: 4px;
        text-align: center;
        color: #ffffff;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }
      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
}
</style>
