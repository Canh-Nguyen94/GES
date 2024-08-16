export default {
  mounted(el, binding) {
    const { color, size } = binding.value

    const item = el
    const path = el.querySelector('path')

    if (!item) return false

    color && item.setAttribute('fill', color)
    color && path?.setAttribute('stroke', color)
    size && item.setAttribute('width', `${size}px`)
    size && item.setAttribute('height', `${size}px`)
  },

  updated(el, binding) {
    const { color, size } = binding.value

    const item = el
    const path = el.querySelector('path')

    if (!item) return false

    color && item.setAttribute('fill', color)
    color && path?.setAttribute('stroke', color)
    size && item.setAttribute('width', `${size}px`)
    size && item.setAttribute('height', `${size}px`)
  }
}
