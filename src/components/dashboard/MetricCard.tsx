import React from 'react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  trend = 'stable',
  color 
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      case 'stable':
        return 'trend-stable';
      default:
        return 'trend-stable';
    }
  };

  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className={`metric-trend ${getTrendClass()}`}>
          {getTrendIcon()}
        </span>
      </div>
      
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-value">
          <span className="value">{value}</span>
          {unit && <span className="unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;