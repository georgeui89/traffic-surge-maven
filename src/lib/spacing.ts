// Base spacing unit (4px)
const BASE_UNIT = 0.25;

// Generate spacing scale
export const generateSpacingScale = (maxUnits = 64) => {
  const scale: Record<string, string> = {
    '0': '0',
  };
  
  // Generate fractional units
  scale['0.5'] = `${BASE_UNIT / 2}rem`; // 2px
  scale['1.5'] = `${BASE_UNIT * 1.5}rem`; // 6px
  scale['2.5'] = `${BASE_UNIT * 2.5}rem`; // 10px
  scale['3.5'] = `${BASE_UNIT * 3.5}rem`; // 14px
  
  // Generate integer units
  for (let i = 1; i <= maxUnits; i++) {
    scale[i.toString()] = `${BASE_UNIT * i}rem`;
  }
  
  return scale;
};

export const spacing = generateSpacingScale();

// Common spacing values with semantic names
export const spacingSemantics = {
  // Component spacing
  componentXS: spacing['1'],    // 4px
  componentSM: spacing['2'],    // 8px
  componentMD: spacing['4'],    // 16px
  componentLG: spacing['6'],    // 24px
  componentXL: spacing['8'],    // 32px
  
  // Layout spacing
  layoutXS: spacing['4'],       // 16px
  layoutSM: spacing['6'],       // 24px
  layoutMD: spacing['8'],       // 32px
  layoutLG: spacing['12'],      // 48px
  layoutXL: spacing['16'],      // 64px
  
  // Inset padding
  insetXS: spacing['1'],        // 4px
  insetSM: spacing['2'],        // 8px
  insetMD: spacing['3'],        // 12px
  insetLG: spacing['4'],        // 16px
  insetXL: spacing['6'],        // 24px
  
  // Stack spacing (vertical)
  stackXS: spacing['1'],        // 4px
  stackSM: spacing['2'],        // 8px
  stackMD: spacing['4'],        // 16px
  stackLG: spacing['6'],        // 24px
  stackXL: spacing['8'],        // 32px
  
  // Inline spacing (horizontal)
  inlineXS: spacing['1'],       // 4px
  inlineSM: spacing['2'],       // 8px
  inlineMD: spacing['3'],       // 12px
  inlineLG: spacing['4'],       // 16px
  inlineXL: spacing['6'],       // 24px
};

// Generate CSS variables for spacing
export const generateSpacingVariables = () => {
  let cssVars = ':root {\\n';
  
  // Add base spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    cssVars += `  --spacing-${key.replace('.', '_')}: ${value};\\n`;
  });
  
  // Add semantic spacing variables
  Object.entries(spacingSemantics).forEach(([key, value]) => {
    cssVars += `  --${key}: ${value};\\n`;
  });
  
  cssVars += '}';
  
  return cssVars;
};