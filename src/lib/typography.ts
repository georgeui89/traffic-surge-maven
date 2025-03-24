export const typography = {
  fontFamily: {
    sans: [
      '"SF Pro Display"',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace',
    ],
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  // Type scale for consistent hierarchy
  scale: {
    h1: {
      fontSize: '2.25rem', // 36px
      lineHeight: '1.2',
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      lineHeight: '1.3',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h6: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    body: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0',
    },
    bodySmall: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0',
    },
    button: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '0',
    },
  },
};

// Generate CSS variables for typography
export const generateTypographyVariables = () => {
  return `
    :root {
      --font-sans: ${typography.fontFamily.sans.join(', ')};
      --font-mono: ${typography.fontFamily.mono.join(', ')};
      
      --font-h1-size: ${typography.scale.h1.fontSize};
      --font-h1-line-height: ${typography.scale.h1.lineHeight};
      --font-h1-weight: ${typography.scale.h1.fontWeight};
      --font-h1-letter-spacing: ${typography.scale.h1.letterSpacing};
      
      --font-h2-size: ${typography.scale.h2.fontSize};
      --font-h2-line-height: ${typography.scale.h2.lineHeight};
      --font-h2-weight: ${typography.scale.h2.fontWeight};
      --font-h2-letter-spacing: ${typography.scale.h2.letterSpacing};
      
      --font-h3-size: ${typography.scale.h3.fontSize};
      --font-h3-line-height: ${typography.scale.h3.lineHeight};
      --font-h3-weight: ${typography.scale.h3.fontWeight};
      --font-h3-letter-spacing: ${typography.scale.h3.letterSpacing};
      
      --font-h4-size: ${typography.scale.h4.fontSize};
      --font-h4-line-height: ${typography.scale.h4.lineHeight};
      --font-h4-weight: ${typography.scale.h4.fontWeight};
      --font-h4-letter-spacing: ${typography.scale.h4.letterSpacing};
      
      --font-body-size: ${typography.scale.body.fontSize};
      --font-body-line-height: ${typography.scale.body.lineHeight};
      --font-body-weight: ${typography.scale.body.fontWeight};
      --font-body-letter-spacing: ${typography.scale.body.letterSpacing};
      
      --font-small-size: ${typography.scale.bodySmall.fontSize};
      --font-small-line-height: ${typography.scale.bodySmall.lineHeight};
      --font-small-weight: ${typography.scale.bodySmall.fontWeight};
      --font-small-letter-spacing: ${typography.scale.bodySmall.letterSpacing};
    }
  `;
};