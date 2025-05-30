// Base types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Sensor types
export interface Sensor extends BaseEntity {
  name: string;
  location: string;
  type: SensorType;
  status: SensorStatus;
  battery: number;
  lastReading?: SensorReading;
  configuration: SensorConfiguration;
}

export interface SensorReading extends BaseEntity {
  sensorId: string;
  temperature: number;
  humidity: number;
  pressure?: number;
  timestamp: string;
  quality: ReadingQuality;
}

export interface SensorConfiguration {
  readingInterval: number; // seconds
  temperatureRange: {
    min: number;
    max: number;
  };
  humidityRange: {
    min: number;
    max: number;
  };
  alerts: AlertConfiguration;
}

export interface AlertConfiguration {
  temperatureAlert: boolean;
  humidityAlert: boolean;
  batteryAlert: boolean;
  offlineAlert: boolean;
  thresholds: {
    temperatureMin: number;
    temperatureMax: number;
    humidityMin: number;
    humidityMax: number;
    batteryMin: number;
  };
}

// Enums
export enum SensorType {
  TEMPERATURE_HUMIDITY = 'temperature_humidity',
  TEMPERATURE_PRESSURE = 'temperature_pressure',
  MULTI_SENSOR = 'multi_sensor'
}

export enum SensorStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  WARNING = 'warning',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

export enum ReadingQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

// Dashboard types
export interface DashboardSummary {
  totalSensors: number;
  activeSensors: number;
  warningCount: number;
  errorCount: number;
  avgTemperature: number;
  avgHumidity: number;
  lastUpdate: string;
}

export interface MetricTrend {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  sensorId?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  type?: 'primary' | 'secondary';
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  temperatureUnit: 'celsius' | 'fahrenheit';
  refreshInterval: number;
  notifications: {
    desktop: boolean;
    email: boolean;
    sound: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'sensors' | 'charts';
    chartsTimeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  };
}