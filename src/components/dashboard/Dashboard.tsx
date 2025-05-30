import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import Chart from './Chart';
import Loading from '../common/Loading';
import { useApi } from '../../hooks/useApi';
import './Dashboard.css';

interface DashboardData {
  sensors: Array<{
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    lastUpdate: string;
    status: 'online' | 'offline';
  }>;
  summary: {
    totalSensors: number;
    activeSensors: number;
    avgTemperature: number;
    avgHumidity: number;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useApi();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: DashboardData = {
          sensors: [
            {
              id: '1',
              name: 'Freezer A1',
              temperature: -18.5,
              humidity: 65,
              lastUpdate: new Date().toISOString(),
              status: 'online'
            },
            {
              id: '2', 
              name: 'Freezer B2',
              temperature: -20.1,
              humidity: 62,
              lastUpdate: new Date().toISOString(),
              status: 'online'
            },
            {
              id: '3',
              name: 'Cold Room',
              temperature: 4.2,
              humidity: 78,
              lastUpdate: new Date().toISOString(),
              status: 'offline'
            }
          ],
          summary: {
            totalSensors: 3,
            activeSensors: 2,
            avgTemperature: -11.5,
            avgHumidity: 68.3
          }
        };
        
        setData(mockData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (!data) {
    return (
      <div className="dashboard-error">
        <h2>❌ Error Loading Dashboard</h2>
        <p>Unable to load dashboard data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 System Overview</h2>
        <p>Real-time monitoring of all ice pulse sensors</p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Total Sensors"
          value={data.summary.totalSensors}
          unit=""
          icon="📡"
          trend="stable"
        />
        <MetricCard
          title="Active Sensors"
          value={data.summary.activeSensors}
          unit=""
          icon="🟢"
          trend="stable"
        />
        <MetricCard
          title="Avg Temperature"
          value={data.summary.avgTemperature}
          unit="°C"
          icon="🌡️"
          trend="down"
        />
        <MetricCard
          title="Avg Humidity"
          value={data.summary.avgHumidity}
          unit="%"
          icon="💧"
          trend="up"
        />
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h3>📈 Temperature Trends</h3>
          <Chart data={data.sensors} />
        </div>

        <div className="sensors-overview">
          <h3>📡 Sensor Status</h3>
          <div className="sensor-list">
            {data.sensors.map(sensor => (
              <div key={sensor.id} className={`sensor-item ${sensor.status}`}>
                <div className="sensor-info">
                  <h4>{sensor.name}</h4>
                  <p>{sensor.temperature}°C • {sensor.humidity}% RH</p>
                </div>
                <div className={`sensor-status ${sensor.status}`}>
                  {sensor.status === 'online' ? '🟢' : '🔴'} {sensor.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;