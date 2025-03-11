import Vue from 'vue'
import {
  hasPermission,
  hasNoPermission,
  hasAnyPermission,
  hasRole,
  hasAnyRole
} from './permissionDirect'
import { dialogDrag } from './dialogDragDirect'
import { inputFilter } from './inputFilter'
import { copyText } from './copyDirect'

const Plugins = [
  hasPermission,
  hasNoPermission,
  hasAnyPermission,
  hasRole,
  hasAnyRole,
  dialogDrag,
  inputFilter,
  copyText
]

Plugins.forEach((plugin) => {
  Vue.use(plugin)
})

export default Vue
