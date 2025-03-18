<template>
  <div class="noneLayout-page">
    <appScreenMain></appScreenMain>
  </div>
</template>

<script>
import appScreenMain from '@/components/noneLayout/largeScreen/appScreenMain.vue'

export default {
  name: 'noneLayout',
  components: { appScreenMain }
}
</script>

<style lang="less">
.noneLayout-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0px 0px;
  background-color: #fff;
}
</style>
