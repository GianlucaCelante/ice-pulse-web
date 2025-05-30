/**
 * Format temperature value with unit
 */
export const formatTemperature = (
  value: number,
  unit: 'celsius' | 'fahrenheit' = 'celsius',
  decimals: number = 1
): string => {
  const convertedValue = unit === 'fahrenheit' ? (value * 9/5) + 32 : value;
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';
  return `${convertedValue.toFixed(decimals)}${symbol}`;
};

/**
 * Format humidity value
 */
export const formatHumidity = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format pressure value
 */
export const formatPressure = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)} hPa`;
};

/**
 * Format timestamp to relative time
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Format timestamp to local date and time
 */
export const formatDateTime = (
  timestamp: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(timestamp);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  return date.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (
  value: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string => {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  total: number,
  decimals: number = 1
): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format duration in milliseconds to human readable
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Generate random color for charts
 */
export const generateColor = (index: number): string => {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];
  return colors[index % colors.length];
};

/**
 * Format sensor status with emoji
 */
export const formatSensorStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    online: '🟢 Online',
    offline: '🔴 Offline',
    warning: '🟡 Warning',
    error: '🔴 Error',
    maintenance: '🔧 Maintenance'
  };
  return statusMap[status] || '⚪ Unknown';
};