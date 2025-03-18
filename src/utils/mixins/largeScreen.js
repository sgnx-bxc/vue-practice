export default {
  data() {
    return {
      screenWidth: '',
      screenHeight: ''
    }
  },
  watch: {
    screenWidth() {
      this.resize()
    },
    screenHeight() {
      this.resize()
    }
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.getScreen)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getScreen)
  },
  methods: {
    getScreen() {
      this.screenWidth =
        document.documentElement.clientWidth || document.body.clientWidth
      this.screenHeight =
        document.documentElement.clientHeight || document.body.clientHeight
    },
    resize() {
      const contW = 1920
      const contH1 = 1080 // 全屏
      const contH2 = 969 // 收藏栏隐藏
      const contH3 = 937 // 收藏栏显示
      // const k1 = contW / contH1
      const k2 = contW / contH2
      const k3 = contW / contH3
      const cliWidth =
        document.documentElement.innerWidth || document.body.clientWidth
      const cliHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      const k = cliWidth / cliHeight
      let contH = 0
      if (k >= k3) {
        contH = contH3
        this.$store.commit('system/setClientHeightType', 2)
      } else if (k < k3 && k >= k2) {
        contH = contH2
        this.$store.commit('system/setClientHeightType', 1)
      } else {
        contH = contH1
        this.$store.commit('system/setClientHeightType', 0)
      }
      let w = cliWidth / contW
      let h = cliHeight / contH
      w = w <= 0.5 ? 0.5 : w
      h = h <= 0.5 ? 0.5 : h
      const appstyle = document.getElementById('edr-largeScreen')
      window.appXscale = w
      window.appYscale = h
      appstyle.style.transform = 'translateZ(0) scale(' + w + ',' + h + ')'
      appstyle.style.transformOrigin = 'top left'
      appstyle.style.width = contW + 'px'
      appstyle.style.height = contH + 'px'
      appstyle.style.overflow = 'hidden'
      this.$bus.$emit('resizeChart')
    }
  }
}
