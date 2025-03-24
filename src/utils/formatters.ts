
/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with commas
 * @param value Number to format
 * @returns Formatted number string with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a percentage
 * @param value Number to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a CPM value
 * @param value CPM value
 * @returns Formatted CPM string
 */
export const formatCpm = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

/**
 * Format a ROI value
 * @param value ROI value
 * @returns Formatted ROI string with +/- prefix
 */
export const formatRoi = (value: number): string => {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
};

/**
 * Returns a color based on status
 * @param status Status string ('healthy', 'warning', 'error', etc.)
 * @returns CSS color class
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'healthy':
    case 'online':
    case 'active':
    case 'success':
      return 'text-success bg-success/10';
    case 'warning':
    case 'pending':
    case 'paused':
      return 'text-warning bg-warning/10';
    case 'error':
    case 'offline':
    case 'failed':
      return 'text-destructive bg-destructive/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

/**
 * Returns a color based on metric performance
 * @param value Current value
 * @param target Target value
 * @param inverse If true, lower values are better
 * @returns CSS color class
 */
export const getPerformanceColor = (value: number, target: number, inverse = false): string => {
  const ratio = value / target;
  
  if (inverse) {
    if (ratio <= 0.8) return 'text-success';
    if (ratio <= 1.0) return 'text-warning';
    return 'text-destructive';
  } else {
    if (ratio >= 1.0) return 'text-success';
    if (ratio >= 0.8) return 'text-warning';
    return 'text-destructive';
  }
};

/**
 * Truncate text if it exceeds a specified length
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, length = 30): string => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date): string => {
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return formatter.format(-diffInSeconds, 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return formatter.format(-diffInMinutes, 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return formatter.format(-diffInHours, 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return formatter.format(-diffInDays, 'day');
};
