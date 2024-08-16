import { DirectiveBinding } from 'vue'
import { useRoleAccess } from '@composables'

export default {
  mounted(el, binding) {
    const { value } = binding

    if (!value) return false

    const canAccess = useRoleAccess(value, false)
    if (!canAccess) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
