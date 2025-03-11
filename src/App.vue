<template>
  <div id="edr" :class="{ maxWidthHeight: maxWidthHeight }">
    <router-view v-if="display"></router-view>
  </div>
</template>

<script>
import newHashMixin from '@/utils/mixins/newHashMixin'

export default {
  name: 'app',
  mixins: [newHashMixin],
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      maxWidthHeight: true,
      display: true
    }
  },
  mounted() {
    const self = this
    this.$bus.on('cancelMaxWidthHeight', () => {
      self.maxWidthHeight = false
    })
  },
  methods: {
    reload() {
      this.display = false
      this.$nextTick(function () {
        this.display = true
      })
    }
  }
}
</script>

<style lang="less">
html,
body,
#edr {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
  padding: 0px 0px;
  &.maxWidthHeight {
    min-width: 1346px;
    min-height: 760px;
  }
}
</style>
