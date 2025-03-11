export default {
  mounted() {
    window.addEventListener('beforeunload', this.getLeave, false)
  },
  beforeRouteLeave(to, from, next) {
    const self = this
    let flag = this.ifEdit
    let loopShow = true
    if (flag && loopShow) {
      this.$confirm(
        `该页面处于编辑状态，离开后内容不会保存，是否确定离开？`,
        '提示',
        {
          customClass: 'default-message-style'
        }
      )
        .then(() => {
          this.ifEdit = false
          next()
        })
        .catch(() => {
          loopShow = false
          const keyChange = 'bus'
          self.$bus.$emit('menuActiveChange', keyChange)
        })
    } else {
      next()
    }
  },
  methods: {
    getLeave(e) {
      if (this.ifEdit) {
        e.returnValue = 'tips'
      }
    }
  }
}
