import { ApiResponse, PaginatedResponse, Sensor, SensorReading, DashboardSummary } from '../types';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.request<{ status: string; timestamp: string }>('/health');
    return response.data;
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await this.request<DashboardSummary>('/api/dashboard/summary');
    return response.data;
  }

  // Sensors
  async getSensors(page = 1, pageSize = 20): Promise<PaginatedResponse<Sensor>> {
    const response = await this.request<PaginatedResponse<Sensor>>(
      `/api/sensors?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getSensor(id: string): Promise<Sensor> {
    const response = await this.request<Sensor>(`/api/sensors/${id}`);
    return response.data;
  }

  async createSensor(sensor: Partial<Sensor>): Promise<Sensor> {
    const response = await this.request<Sensor>('/api/sensors', {
      method: 'POST',
      body: JSON.stringify(sensor),
    });
    return response.data;
  }

  async updateSensor(id: string, sensor: Partial<Sensor>): Promise<Sensor> {
    const response = await this.request<Sensor>(`/api/sensors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sensor),
    });
    return response.data;
  }

  async deleteSensor(id: string): Promise<void> {
    await this.request(`/api/sensors/${id}`, {
      method: 'DELETE',
    });
  }

  // Sensor readings
  async getSensorReadings(
    sensorId: string,
    timeRange: string = '24h'
  ): Promise<SensorReading[]> {
    const response = await this.request<SensorReading[]>(
      `/api/sensors/${sensorId}/readings?timeRange=${timeRange}`
    );
    return response.data;
  }

  async getLatestReadings(): Promise<SensorReading[]> {
    const response = await this.request<SensorReading[]>('/api/readings/latest');
    return response.data;
  }

  // Charts data
  async getChartData(
    sensorIds: string[],
    timeRange: string = '24h'
  ): Promise<{ timestamp: string; [sensorId: string]: number | string }[]> {
    const params = new URLSearchParams({
      timeRange,
      sensorIds: sensorIds.join(','),
    });
    
    const response = await this.request<{ timestamp: string; [sensorId: string]: number | string }[]>(
      `/api/charts/data?${params}`
    );
    return response.data;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;