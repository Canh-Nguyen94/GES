import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import theme from '@config/theme'

function formatColors() {
  const colors = []
  for (const [key, color] of Object.entries(theme.colors)) {
    if (typeof color === 'string') {
      colors.push(key)
    } else {
      Object.keys(color).forEach((subKey) =>
        subKey === 'DEFAULT' ? colors.push(key) : colors.push(`${key}-${subKey}`)
      )
    }
  }
  return colors
}

const customTwMerge = extendTailwindMerge({
  theme: {
    colors: formatColors()
  },
  override: {
    classGroups: {
      'font-size': Object.keys(theme.fontSize).map((key) => `text-${key}`)
    }
  }
})

export function cn(...inputs) {
  return customTwMerge(clsx(inputs))
}

export function valueUpdater(updaterOrValue, ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}
