/**
 * Kabadiwala Connect Design System Tokens
 * Source of Truth: DESIGN.md (High-Contrast Utilitarian Tactility)
 */

export const colors = {
  // Brand Primaries
  primary: '#004e2a',
  'primary-container': '#20673f',
  'on-primary': '#ffffff',
  'on-primary-container': '#9be3b0',
  'primary-fixed': '#aaf3bf',
  'primary-fixed-dim': '#8fd6a5',
  'on-primary-fixed': '#00210f',
  'on-primary-fixed-variant': '#00522c',
  'inverse-primary': '#8fd6a5',
  'surface-tint': '#246b42',

  // Secondary & Monetary Accents
  secondary: '#8a5100',
  'secondary-container': '#ffa02c',
  'on-secondary': '#ffffff',
  'on-secondary-container': '#693d00',
  'secondary-fixed': '#ffdcbd',
  'secondary-fixed-dim': '#ffb86e',
  'on-secondary-fixed': '#2c1600',
  'on-secondary-fixed-variant': '#693c00',

  // Tertiary & Warnings / Hazard
  tertiary: '#8c000e',
  'tertiary-container': '#b4151d',
  'on-tertiary': '#ffffff',
  'on-tertiary-container': '#ffc5bf',
  'tertiary-fixed': '#ffdad6',
  'tertiary-fixed-dim': '#ffb3ac',
  'on-tertiary-fixed': '#410003',
  'on-tertiary-fixed-variant': '#930010',
  error: '#ba1a1a',
  'error-container': '#ffdad6',
  'on-error': '#ffffff',
  'on-error-container': '#93000a',

  // Surfaces & Backgrounds
  surface: '#f8faf6',
  'surface-dim': '#d9dad7',
  'surface-bright': '#f8faf6',
  'surface-variant': '#e1e3df',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f3f4f0',
  'surface-container': '#edeeeb',
  'surface-container-high': '#e7e9e5',
  'surface-container-highest': '#e1e3df',
  background: '#f8faf6',
  'on-background': '#191c1a',
  'on-surface': '#191c1a',
  'on-surface-variant': '#404941',
  'inverse-surface': '#2e312f',
  'inverse-on-surface': '#f0f1ed',
  outline: '#707a71',
  'outline-variant': '#bfc9bf'
};

export const typography = {
  fontFamily: {
    sans: ['Noto Sans', 'sans-serif'],
    display: ['Noto Sans', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  fontSize: {
    'label-md': ['16px', { lineHeight: '22px', fontWeight: '700' }],
    'label-lg': ['18px', { lineHeight: '24px', fontWeight: '700' }],
    'body-lg': ['18px', { lineHeight: '26px', fontWeight: '400' }],
    'body-bold': ['18px', { lineHeight: '26px', fontWeight: '700' }],
    'body-xl': ['20px', { lineHeight: '28px', fontWeight: '500' }],
    'headline-md': ['22px', { lineHeight: '30px', fontWeight: '700' }],
    'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
    'headline-lg': ['28px', { lineHeight: '36px', fontWeight: '700' }],
    'headline-xl-mobile': ['30px', { lineHeight: '38px', fontWeight: '800' }],
    'headline-xl': ['36px', { lineHeight: '44px', fontWeight: '800' }],
    'currency-lg': ['28px', { lineHeight: '34px', fontWeight: '800' }],
    'currency-xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.5px', fontWeight: '900' }]
  }
};

export const borderRadius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px'
};

export const spacing = {
  'space-xs': '0.5rem',
  'space-sm': '0.75rem',
  'space-md': '1rem',
  'space-lg': '1.5rem',
  'space-xl': '2rem',
  'space-2xl': '3rem',
  gutter: '1rem',
  'gutter-tablet': '1.5rem',
  margin: '1rem',
  'margin-tablet': '2rem'
};
