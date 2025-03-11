<template>
  <div class="installTimeChart-page">
    <div class="box-item">
      <li
        :class="{ 'number-item': !isNaN(item) }"
        v-for="(item, index) in orderNum"
        :key="index"
      >
        <span>
          <i ref="numberItem">0123456789</i>
        </span>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'installTimeChart',
  data() {
    return {
      orderNum: ['0', '0', '0', '0', '0'],
      maxlength: 5
    }
  },
  methods: {
    initCharts(installTime) {
      this.showRollAnimate(installTime)
    },
    showRollAnimate(installTime) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.toOrderNum(installTime)
            }
          })
        },
        { threshold: 0.5 }
      )
      observer.observe(document.querySelector('.box-item'))
    },
    setNumberTransform() {
      const numberItems = this.$refs.numberItem
      const numberArr = this.orderNum.filter((item) => !isNaN(item))
      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
      }
    },
    toOrderNum(num) {
      num = num.toString()
      if (num.length < this.maxlength) {
        num = '0' + num
        this.toOrderNum(num)
      } else {
        this.orderNum = num.split('')
      }
      this.setNumberTransform()
    }
  }
}
</script>

<style lang="less">
.installTimeChart-page {
  .box-item {
    position: relative;
    line-height: 41px;
    font-size: 48px;
    font-family: 'DIN-Alternate-Bold';
    text-align: center;
    color: #ffffff;
    list-style: none;
    writing-mode: vertical-lr;
    text-orientation: upright;
    user-select: none;
  }
  /*滚动数字设置*/
  .number-item {
    width: 50px;
    height: 73px;
    list-style: none;
    margin-right: 5px;
    background: url('~@/assets/img/aboutEcharts/ico_num_roll.png') no-repeat;
    background-size: 100% 100%;
    & > span {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 100%;
      height: 100%;
      writing-mode: vertical-rl;
      text-orientation: upright;
      overflow: hidden;
      & > i {
        font-style: normal;
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translate(-50%, 0);
        transition: transform 1.2s ease-out;
        letter-spacing: 10px;
      }
    }
  }
  .number-item:last-child {
    margin-right: 0;
  }
}
</style>
