import { cva } from 'class-variance-authority'

export { default as Text } from './Text.vue'

const textVariant = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  blockquote: 'border-l-2 pl-6 italic',
  th: 'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
  td: 'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground'
}

const textSize = {
  '3xl': 'text-3xl',
  '2xl': 'text-2xl',
  xl: 'text-xl',
  lg: 'text-lg',
  base: 'text-sm',
  sm: 'text-sm',
  xs: 'text-xs'
}

const textType = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  danger: 'text-danger',
  accent: 'text-accent-light-blue'
}

const textFont = {
  md: 'font-medium',
  semi: 'font-semibold',
  extra: 'font-extrabold'
}

export const textVariants = cva('break-words', {
  variants: {
    variant: textVariant,
    size: textSize,
    type: textType,
    font: textFont
  },
  defaultVariants: {
    variant: '',
    size: '',
    type: '',
    font: ''
  }
})

export { textVariant, textSize, textType, textFont }
