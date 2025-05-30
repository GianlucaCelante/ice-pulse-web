import React, { useState, useEffect } from 'react';
import { Sensor, SensorReading } from '../../types';
import { formatTemperature, formatHumidity, formatDateTime, formatRelativeTime } from '../../utils/formatters';
import Chart from '../dashboard/Chart';
import Loading from '../common/Loading';
import './SensorDetails.css';

interface SensorDetailsProps {
  sensor: Sensor;
  onBack: () => void;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({ sensor, onBack }) => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [activeTab, setActiveTab] = useState<'overview' | 'readings' | 'settings'>('overview');

  const loadReadings = async () => {
    setLoading(true);
    
    try {
      // Simulate API call with mock historical data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const now = new Date();
      const mockReadings: SensorReading[] = [];
      
      // Generate mock readings based on time range
      const intervals = {
        '1h': { count: 12, intervalMs: 5 * 60 * 1000 }, // 5 min intervals
        '6h': { count: 36, intervalMs: 10 * 60 * 1000 }, // 10 min intervals
        '24h': { count: 48, intervalMs: 30 * 60 * 1000 }, // 30 min intervals
        '7d': { count: 168, intervalMs: 60 * 60 * 1000 }, // 1 hour intervals
      };
      
      const { count, intervalMs } = intervals[timeRange];
      
      for (let i = count; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * intervalMs);
        const baseTemp = sensor.lastReading?.temperature || 20;
        const baseHumidity = sensor.lastReading?.humidity || 60;
        
        // Add some realistic variation
        const tempVariation = (Math.random() - 0.5) * 4;
        const humidityVariation = (Math.random() - 0.5) * 10;
        
        mockReadings.push({
          id: `reading-${sensor.id}-${i}`,
          sensorId: sensor.id,
          temperature: Number((baseTemp + tempVariation).toFixed(1)),
          humidity: Number((baseHumidity + humidityVariation).toFixed(1)),
          pressure: sensor.lastReading?.pressure ? 
            Number((1013.25 + (Math.random() - 0.5) * 20).toFixed(2)) : undefined,
          timestamp: timestamp.toISOString(),
          quality: Math.random() > 0.8 ? 'good' : 'excellent' as any,
          createdAt: timestamp.toISOString(),
          updatedAt: timestamp.toISOString()
        });
      }
      
      setReadings(mockReadings.reverse());
    } catch (error) {
      console.error('Error loading readings:', error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    loadReadings();
    }, [sensor.id, timeRange, loadReadings]);

  const getStatusColor = (status: string) => {
    const colors = {
      online: '#10b981',
      offline: '#ef4444',
      warning: '#f59e0b',
      error: '#ef4444',
      maintenance: '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return '#10b981';
    if (battery > 20) return '#f59e0b';
    return '#ef4444';
  };

  const getAverageValues = () => {
    if (readings.length === 0) return null;
    
    const avgTemp = readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length;
    const avgHumidity = readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length;
    const minTemp = Math.min(...readings.map(r => r.temperature));
    const maxTemp = Math.max(...readings.map(r => r.temperature));
    
    return { avgTemp, avgHumidity, minTemp, maxTemp };
  };

  const averages = getAverageValues();

  const renderOverview = () => (
    <div className="details-overview">
      <div className="overview-cards">
        <div className="overview-card">
          <h4>📊 Current Status</h4>
          <div className="status-info">
            <div className="status-item">
              <span className="status-dot" style={{ backgroundColor: getStatusColor(sensor.status) }}></span>
              <span className="status-text">{sensor.status.toUpperCase()}</span>
            </div>
            <div className="status-item">
              <span>🔋</span>
              <span style={{ color: getBatteryColor(sensor.battery) }}>
                {sensor.battery}% Battery
              </span>
            </div>
            <div className="status-item">
              <span>📍</span>
              <span>{sensor.location}</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h4>🌡️ Latest Reading</h4>
          {sensor.lastReading ? (
            <div className="current-readings">
              <div className="reading-row">
                <span>Temperature:</span>
                <span className="reading-value">
                  {formatTemperature(sensor.lastReading.temperature)}
                </span>
              </div>
              <div className="reading-row">
                <span>Humidity:</span>
                <span className="reading-value">
                  {formatHumidity(sensor.lastReading.humidity)}
                </span>
              </div>
              {sensor.lastReading.pressure && (
                <div className="reading-row">
                  <span>Pressure:</span>
                  <span className="reading-value">
                    {sensor.lastReading.pressure.toFixed(1)} hPa
                  </span>
                </div>
              )}
              <div className="reading-time">
                Last updated: {formatRelativeTime(sensor.lastReading.timestamp)}
              </div>
            </div>
          ) : (
            <div className="no-data">No recent readings available</div>
          )}
        </div>

        {averages && (
          <div className="overview-card">
            <h4>📈 Statistics ({timeRange})</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Avg Temp</span>
                <span className="stat-value">{formatTemperature(averages.avgTemp)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Min Temp</span>
                <span className="stat-value">{formatTemperature(averages.minTemp)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Max Temp</span>
                <span className="stat-value">{formatTemperature(averages.maxTemp)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Humidity</span>
                <span className="stat-value">{formatHumidity(averages.avgHumidity)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h4>📈 Temperature Trend</h4>
          <div className="time-range-selector">
            {(['1h', '6h', '24h', '7d'] as const).map(range => (
              <button
                key={range}
                className={`range-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <Loading message="Loading chart data..." size="medium" />
        ) : (
          <div className="chart-container">
            <Chart data={[{
              id: sensor.id,
              name: sensor.name,
              temperature: sensor.lastReading?.temperature || 0,
              humidity: sensor.lastReading?.humidity || 0,
              lastUpdate: sensor.lastReading?.timestamp || '',
              status: sensor.status === 'online' ? 'online' : 'offline'
            }]} />
          </div>
        )}
      </div>
    </div>
  );

  const renderReadings = () => (
    <div className="readings-table-container">
      <div className="readings-header">
        <h4>📋 Reading History</h4>
        <div className="readings-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="time-select"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button className="btn btn-secondary">
            📥 Export
          </button>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading readings..." />
      ) : (
        <div className="readings-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Temperature</th>
                <th>Humidity</th>
                {readings.some(r => r.pressure) && <th>Pressure</th>}
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {readings.map(reading => (
                <tr key={reading.id}>
                  <td>{formatDateTime(reading.timestamp)}</td>
                  <td>{formatTemperature(reading.temperature)}</td>
                  <td>{formatHumidity(reading.humidity)}</td>
                  {readings.some(r => r.pressure) && (
                    <td>{reading.pressure ? `${reading.pressure.toFixed(1)} hPa` : '-'}</td>
                  )}
                  <td>
                    <span className={`quality-badge quality-${reading.quality}`}>
                      {reading.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="sensor-settings">
      <div className="settings-section">
        <h4>⚙️ Configuration</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Reading Interval</label>
            <span>{sensor.configuration.readingInterval} seconds</span>
          </div>
          <div className="setting-item">
            <label>Temperature Range</label>
            <span>
              {sensor.configuration.temperatureRange.min}°C to {sensor.configuration.temperatureRange.max}°C
            </span>
          </div>
          <div className="setting-item">
            <label>Humidity Range</label>
            <span>
              {sensor.configuration.humidityRange.min}% to {sensor.configuration.humidityRange.max}%
            </span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4>🚨 Alert Configuration</h4>
        <div className="alert-settings">
          <div className="alert-item">
            <label>
              <input 
                type="checkbox" 
                checked={sensor.configuration.alerts.temperatureAlert}
                readOnly
              />
              Temperature Alerts
            </label>
          </div>
          <div className="alert-item">
            <label>
              <input 
                type="checkbox" 
                checked={sensor.configuration.alerts.humidityAlert}
                readOnly
              />
              Humidity Alerts
            </label>
          </div>
          <div className="alert-item">
            <label>
              <input 
                type="checkbox" 
                checked={sensor.configuration.alerts.batteryAlert}
                readOnly
              />
              Battery Alerts
            </label>
          </div>
          <div className="alert-item">
            <label>
              <input 
                type="checkbox" 
                checked={sensor.configuration.alerts.offlineAlert}
                readOnly
              />
              Offline Alerts
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4>📝 Device Information</h4>
        <div className="device-info">
          <div className="info-item">
            <label>Device ID:</label>
            <span>{sensor.id}</span>
          </div>
          <div className="info-item">
            <label>Type:</label>
            <span>{sensor.type.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="info-item">
            <label>Created:</label>
            <span>{formatDateTime(sensor.createdAt)}</span>
          </div>
          <div className="info-item">
            <label>Last Updated:</label>
            <span>{formatDateTime(sensor.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary">✏️ Edit Settings</button>
        <button className="btn btn-secondary">🔄 Restart Sensor</button>
        <button className="btn btn-warning">⚠️ Calibrate</button>
        <button className="btn btn-error">🗑️ Delete Sensor</button>
      </div>
    </div>
  );

  return (
    <div className="sensor-details">
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Sensors
        </button>
        <div className="sensor-title">
          <h2>{sensor.name}</h2>
          <p>{sensor.location}</p>
        </div>
        <div className="sensor-actions">
          <button className="btn btn-secondary">📊 Export Data</button>
          <button className="btn btn-primary">✏️ Edit Sensor</button>
        </div>
      </div>

      <div className="details-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'readings' ? 'active' : ''}`}
          onClick={() => setActiveTab('readings')}
        >
          📋 Readings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="details-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'readings' && renderReadings()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default SensorDetails;