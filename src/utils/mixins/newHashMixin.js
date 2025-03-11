/**
 * 版本更新提示功能
 * 用于App.vue的Minxin
 */
import axios from 'axios'
export default {
  data() {
    return {
      tabIsHidden: false,
      timeout: null,
      curHash: '',
      iMessage: false
    }
  },
  mounted() {
    const self = this
    // 监听浏览器标签页隐藏/显示事件
    document.addEventListener('visibilitychange', () => {
      self.tabIsHidden = document.hidden
    })
    // 启动定时刷新
    this.getHash()
  },
  watch: {
    tabIsHidden(oldv, newv) {
      if (!oldv && newv) {
        // 标签页从隐藏切换到显示，开启定时获取
        this.getHash()
      } else {
        // 标签页从显示切换到隐藏
        window.clearTimeout(this.timeout)
        this.timeout = null
      }
    }
  },
  methods: {
    getHash() {
      const self = this
      // 在js中请求首页地址（不会更新页面）
      const origin = window.location.origin
      const pathname = window.location.pathname
      const url = `${origin}${pathname}index.html?time=${new Date().getTime()}`
      axios
        .get(url)
        .then((res) => {
          let el = document.createElement('html')
          el.innerHTML = res.data
          const metas = el.getElementsByTagName('meta')
          let newHash
          if (metas && metas.time && metas.time.content) {
            newHash = metas.time.content
          }
          if (!self.curHash) {
            this.curHash = newHash
            return
          }
          if (newHash !== self.curHash && !self.iMessage) {
            // 版本更新，弹出提示
            this.iMessage = true
            const h = this.$createElement
            this.$message.success({
              message: h('span', null, [
                h('span', null, '当前版本已更新，请刷新后使用'),
                h(
                  'a',
                  {
                    on: {
                      click: function () {
                        window.location.reload()
                      }
                    },
                    style:
                      'cursor: pointer;color: #2e78ff; border-bottom: 1px solid;margin-left: 10px;'
                  },
                  '刷新页面'
                )
              ]),
              duration: 0,
              showClose: true,
              customClass: 'refresh'
            })
          }
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          const intervalTime = 60 * 1000
          window.clearTimeout(this.timeout)
          this.timeout = null
          this.timeout = window.setTimeout(() => {
            this.getHash()
          }, intervalTime)
        })
    }
  }
}
