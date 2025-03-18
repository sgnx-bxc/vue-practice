<template>
  <div class="countTo">
    <countTo
      :startVal="startVal"
      :endVal="endVal"
      :duration="duration"
    ></countTo>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
export default {
  name: 'countTo-page',
  components: { countTo },
  props: {
    // 开始值
    startVal: {
      type: Number,
      default: 0
    },
    // 结束值
    endVal: {
      type: Number,
      default: 0
    },
    // 持续时间
    duration: {
      type: Number,
      default: 1000
    }
  },

  data() {
    return {}
  }
}
</script>
<style lang="less"></style>
