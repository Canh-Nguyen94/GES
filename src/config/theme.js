const container = {
  center: true,
  padding: '2rem',
  screens: {
    '2xl': '1400px'
  }
}

const fontSize = {
  xs: '0.8rem',
  sms: '0.846rem', // 11px
  sm: '1rem', // 13px
  lg: '1.077rem',
  large: '1.231rem',
  xl: '1.378rem',
  '2xl': '1.563rem',
  '3xl': '1.7rem',
  '4xl': '2.154rem',
  '5xl': '3.052rem'
}

const fontFamily = {
  opensans: ['Open sans', 'sans-serif']
}
const colors = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    red: 'hsl(var(--primary-red))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  success: {
    DEFAULT: 'hsl(var(--success))'
  },
  warning: {
    DEFAULT: 'hsl(var(--warning))'
  },
  error: {
    DEFAULT: 'hsl(var(--error))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
  hyper: {
    DEFAULT: 'hsl(var(--hyper))'
  },
  opacity: {
    DEFAULT: 'hsl(var(--opacity))'
  }
}
const borderRadius = {
  xl: 'calc(var(--radius) + 4px)',
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)'
}
const keyframes = {
  'accordion-down': {
    from: { height: 0 },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: 0 }
  },
  'collapsible-down': {
    from: { height: 0 },
    to: { height: 'var(--radix-collapsible-content-height)' }
  },
  'collapsible-up': {
    from: { height: 'var(--radix-collapsible-content-height)' },
    to: { height: 0 }
  }
}
const animation = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'collapsible-down': 'collapsible-down 0.2s ease-in-out',
  'collapsible-up': 'collapsible-up 0.2s ease-in-out'
}

const shadow = {
  'drop-shadow': 'var(--drop-shadow)'
}

export default {
  fontSize,
  fontFamily,
  colors,
  borderRadius,
  keyframes,
  animation,
  container,
  shadow
}
