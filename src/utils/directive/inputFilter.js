/**
 *  输入过滤
 */
const addListener = function(el, type, fn) {
  el.addEventListener(type, fn, false)
}
const intFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/\D/g, '')
  })
}
const specialFilter = function(el) {
  addListener(el, 'keyup', () => {
    el.value = el.value.replace(/[`=!#%^&*<>?]/g, '')
  })
}
export const inputFilter = {
  install(Vue) {
    Vue.directive('inputFilter', {
      bind(el, binding) {
        let element = el
        if (el.tagName.toLowerCase() !== 'input') {
          const input = el.getElementsByTagName('input')[0]
          const textarea = el.getElementsByTagName('textarea')[0]
          element = input || textarea
        }
        switch (binding.arg) {
          case 'int':
            // 只能输入整数，v-input-filter:int
            intFilter(element)
            break
          case 'special':
            // 不能输入部分特殊字符，v-input-filter:special
            specialFilter(element)
            break
          default:
            break
        }
      }
    })
  }
}
