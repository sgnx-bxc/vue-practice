<template>
  <div class="baseG6-page">
    <dagreG6Chart
      ref="dagreG6ChartRef"
      :initNodeDatas="initNodeDatas"
    ></dagreG6Chart>
  </div>
</template>

<script>
import dagreG6Chart from './baseG6/dagreG6Chart.vue'
import { getBaseG6InfoPort } from '@/api/request/aboutG6OrX6'

export default {
  name: 'baseG6',
  components: { dagreG6Chart },
  data() {
    return {
      initNodeDatas: []
    }
  },
  mounted() {
    this.$message.info('页面还在建设中。。。')
    this.initG6Charts()
  },
  methods: {
    async initG6Charts() {
      const res = await getBaseG6InfoPort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        this.initNodeDatas = info
      }
    }
  }
}
</script>

<style lang="less">
.baseG6-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
