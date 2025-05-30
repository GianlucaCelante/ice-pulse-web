// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  DASHBOARD: '/api/dashboard',
  SENSORS: '/api/sensors',
  READINGS: '/api/readings',
  CHARTS: '/api/charts',
} as const;

// Default values
export const DEFAULT_VALUES = {
  REFRESH_INTERVAL: 30000, // 30 seconds
  CHART_TIME_RANGE: '24h',
  PAGE_SIZE: 20,
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT: 10000, // 10 seconds
} as const;

// Status colors
export const STATUS_COLORS = {
  online: '#10b981',
  offline: '#ef4444',
  warning: '#f59e0b',
  error: '#ef4444',
  maintenance: '#6b7280',
} as const;

// Chart colors
export const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
] as const;

// Sensor thresholds
export const SENSOR_THRESHOLDS = {
  TEMPERATURE: {
    MIN: -30,
    MAX: 50,
    CRITICAL_LOW: -25,
    CRITICAL_HIGH: 45,
  },
  HUMIDITY: {
    MIN: 0,
    MAX: 100,
    CRITICAL_LOW: 10,
    CRITICAL_HIGH: 90,
  },
  BATTERY: {
    LOW: 20,
    CRITICAL: 10,
  },
} as const;

// Time ranges for charts
export const TIME_RANGES = {
  '1h': { label: '1 Hour', duration: 3600000 },
  '6h': { label: '6 Hours', duration: 21600000 },
  '24h': { label: '24 Hours', duration: 86400000 },
  '7d': { label: '7 Days', duration: 604800000 },
  '30d': { label: '30 Days', duration: 2592000000 },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'ice-pulse-preferences',
  LAST_REFRESH: 'ice-pulse-last-refresh',
  SENSOR_FILTERS: 'ice-pulse-sensor-filters',
} as const;

// Event names for custom events
export const EVENTS = {
  SENSOR_UPDATE: 'sensor-update',
  CONNECTION_STATUS: 'connection-status',
  THEME_CHANGE: 'theme-change',
} as const;

// Validation rules
export const VALIDATION = {
  SENSOR_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  LOCATION: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  READING_INTERVAL: {
    MIN: 30, // 30 seconds
    MAX: 3600, // 1 hour
  },
} as const;

// Feature flags
export const FEATURES = {
  DARK_MODE: true,
  EXPORT_DATA: true,
  REAL_TIME_UPDATES: true,
  NOTIFICATIONS: true,
  MULTI_LANGUAGE: false,
} as const;