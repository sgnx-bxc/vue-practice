<template>
  <div class="appScreenMain-page" id="edr-largeScreen">
    <router-view></router-view>
  </div>
</template>

<script>
import largeScreen from '@/utils/mixins/largeScreen'

export default {
  name: 'appScreenMain',
  mixins: [largeScreen]
}
</script>

<style lang="less">
#edr-largeScreen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0px 0px;
  background-color: #fff;
}
</style>
