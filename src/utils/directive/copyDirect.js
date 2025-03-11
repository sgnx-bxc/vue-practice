import { Message } from 'element-ui'
export const copyText = {
  install(Vue) {
    Vue.directive('copyText', {
      inserted(el, binding, vnode) {
        el.addEventListener('click', function () {
          const textArea = document.createElement('textarea')
          const content = el.getAttribute('data-content')
          textArea.value = content
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          Message.success('复制成功')
        })
      }
    })
  }
}
