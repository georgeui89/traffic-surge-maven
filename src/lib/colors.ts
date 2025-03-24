export const colors = {
  // Primary palette - Blue
  primary: {
    DEFAULT: '#3B82F6',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  
  // Secondary palette - Green
  secondary: {
    DEFAULT: '#10B981',
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },
  
  // Accent palette - Purple
  accent: {
    DEFAULT: '#8B5CF6',
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },
  
  // Warning palette - Amber
  warning: {
    DEFAULT: '#F59E0B',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },
  
  // Destructive palette - Red
  destructive: {
    DEFAULT: '#EF4444',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
  
  // Success palette - Green
  success: {
    DEFAULT: '#22C55E',
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  
  // Semantic colors for specific application areas
  traffic: '#3B82F6',  // Blue - for traffic metrics
  earnings: '#22C55E', // Green - for revenue metrics
  platforms: '#8B5CF6', // Purple - for platform-related items
  rdp: '#60A5FA',      // Light blue - for RDP-related items
  
  // Dark mode background gradient
  darkGradient: 'linear-gradient(to bottom right, #0F172A, #1E293B)',
  
  // Light mode background gradient
  lightGradient: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
};

// Color combinations for data visualization
export const dataColors = [
  '#3B82F6', // Blue
  '#22C55E', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#6366F1', // Indigo
  '#0EA5E9', // Sky
  '#10B981', // Emerald
];

// Generate CSS variables for the color system
export const generateColorVariables = (isDarkMode = false) => {
  return `
    :root {
      --background: ${isDarkMode ? '#0F172A' : '#FFFFFF'};
      --foreground: ${isDarkMode ? '#F8FAFC' : '#0F172A'};
      
      --card: ${isDarkMode ? '#1E293B' : '#FFFFFF'};
      --card-foreground: ${isDarkMode ? '#F8FAFC' : '#0F172A'};
      
      --popover: ${isDarkMode ? '#1E293B' : '#FFFFFF'};
      --popover-foreground: ${isDarkMode ? '#F8FAFC' : '#0F172A'};
      
      --primary: ${colors.primary.DEFAULT};
      --primary-foreground: #FFFFFF;
      
      --secondary: ${colors.secondary.DEFAULT};
      --secondary-foreground: #FFFFFF;
      
      --accent: ${colors.accent.DEFAULT};
      --accent-foreground: #FFFFFF;
      
      --muted: ${isDarkMode ? '#334155' : '#F1F5F9'};
      --muted-foreground: ${isDarkMode ? '#94A3B8' : '#64748B'};
      
      --destructive: ${colors.destructive.DEFAULT};
      --destructive-foreground: #FFFFFF;
      
      --success: ${colors.success.DEFAULT};
      --success-foreground: #FFFFFF;
      
      --warning: ${colors.warning.DEFAULT};
      --warning-foreground: #FFFFFF;
      
      --traffic: ${colors.traffic};
      --traffic-foreground: #FFFFFF;
      
      --earnings: ${colors.earnings};
      --earnings-foreground: #FFFFFF;
      
      --platforms: ${colors.platforms};
      --platforms-foreground: #FFFFFF;
      
      --rdp: ${colors.rdp};
      --rdp-foreground: #FFFFFF;
      
      --border: ${isDarkMode ? '#334155' : '#E2E8F0'};
      --input: ${isDarkMode ? '#334155' : '#E2E8F0'};
      --ring: ${isDarkMode ? '#94A3B8' : '#94A3B8'};
      
      --radius: 0.5rem;
    }
  `;
};