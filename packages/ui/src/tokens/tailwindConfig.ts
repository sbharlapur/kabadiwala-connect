import { colors, typography, borderRadius, spacing } from './designTokens';

export const kabadiwalaTailwindPreset = {
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      borderRadius,
      spacing,
      boxShadow: {
        tactile: '0px 4px 0px 0px rgba(25, 28, 26, 0.12)',
        'tactile-pressed': '0px 1px 0px 0px rgba(25, 28, 26, 0.12)',
        'tactile-primary': '0px 4px 0px 0px #00210f',
        'tactile-secondary': '0px 4px 0px 0px #693d00'
      }
    }
  }
};
