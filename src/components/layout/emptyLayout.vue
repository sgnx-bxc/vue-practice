<template>
  <keep-alive v-bind:include="cachedArr">
    <router-view v-loading="apiLoading" />
  </keep-alive>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {
    apiLoading() {
      return this.$store.getters['system/getApiLoading']
    },
    cachedArr() {
      const cachedArrInfo = this.$store.getters['system/getCachedArrInfo']
      const needArr = cachedArrInfo.map(item => item.name)
      return needArr
    }
  }
}
</script>
