import React from 'react';
import { Sensor } from '../../types';
import { formatTemperature, formatHumidity, formatRelativeTime, formatSensorStatus } from '../../utils/formatters';
import './SensorCard.css';

interface SensorCardProps {
  sensor: Sensor;
  onClick: () => void;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor, onClick }) => {
  const getBatteryIcon = (battery: number) => {
    if (battery > 75) return '🔋';
    if (battery > 50) return '🔋';
    if (battery > 25) return '🪫';
    return '🪫';
  };

  const getBatteryClass = (battery: number) => {
    if (battery > 50) return 'battery-good';
    if (battery > 20) return 'battery-warning';
    return 'battery-critical';
  };

  const getSignalQuality = () => {
    if (!sensor.lastReading) return 'No Data';
    
    const now = new Date();
    const lastUpdate = new Date(sensor.lastReading.timestamp);
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) return 'Excellent';
    if (diffMinutes < 15) return 'Good';
    if (diffMinutes < 60) return 'Fair';
    return 'Poor';
  };

  const getSignalIcon = () => {
    const quality = getSignalQuality();
    switch (quality) {
      case 'Excellent': return '📶';
      case 'Good': return '📶';
      case 'Fair': return '📶';
      case 'Poor': return '📵';
      default: return '❓';
    }
  };

  return (
    <div 
      className={`sensor-card ${sensor.status}`}
      onClick={onClick}
    >
      <div className="sensor-card-header">
        <div className="sensor-info">
          <h3 className="sensor-name">{sensor.name}</h3>
          <p className="sensor-location">📍 {sensor.location}</p>
        </div>
        <div className="sensor-status">
          <span className={`status-badge status-${sensor.status}`}>
            {formatSensorStatus(sensor.status)}
          </span>
        </div>
      </div>

      <div className="sensor-readings">
        {sensor.lastReading ? (
          <>
            <div className="reading-item">
              <span className="reading-icon">🌡️</span>
              <div className="reading-content">
                <span className="reading-label">Temperature</span>
                <span className="reading-value">
                  {formatTemperature(sensor.lastReading.temperature)}
                </span>
              </div>
            </div>
            
            <div className="reading-item">
              <span className="reading-icon">💧</span>
              <div className="reading-content">
                <span className="reading-label">Humidity</span>
                <span className="reading-value">
                  {formatHumidity(sensor.lastReading.humidity)}
                </span>
              </div>
            </div>

            {sensor.lastReading.pressure && (
              <div className="reading-item">
                <span className="reading-icon">🌀</span>
                <div className="reading-content">
                  <span className="reading-label">Pressure</span>
                  <span className="reading-value">
                    {sensor.lastReading.pressure.toFixed(1)} hPa
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-readings">
            <span>📭 No recent readings</span>
          </div>
        )}
      </div>

      <div className="sensor-card-footer">
        <div className="sensor-metrics">
          <div className={`metric-item ${getBatteryClass(sensor.battery)}`}>
            <span className="metric-icon">{getBatteryIcon(sensor.battery)}</span>
            <span className="metric-text">{sensor.battery}%</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-icon">{getSignalIcon()}</span>
            <span className="metric-text">{getSignalQuality()}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-icon">🕐</span>
            <span className="metric-text">
              {sensor.lastReading 
                ? formatRelativeTime(sensor.lastReading.timestamp)
                : 'No data'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;