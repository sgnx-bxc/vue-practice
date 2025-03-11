<template>
  <div class="page403">
    <div class="block">
      <div class="wscn-http">
        <div class="bullshit">
          <div class="bullshit__oops">403</div>
          <div class="bullshit__headline">Forbidden</div>
          <div class="bullshit__info">
            无页面访问权限，请与管理员联系。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page403'
}
</script>

<style lang="less">
.page403 {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  border-radius: 4px;
  .block {
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
          font-family: 'Alibaba-PuHuiTi-Bold';
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
          font-family: 'Alibaba-PuHuiTi-Bold';
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
}
</style>
