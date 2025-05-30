import React, { useState, useEffect } from 'react';
import SensorCard from './SensorCard';
import SensorDetails from './SensorDetails';
import Loading from '../common/Loading';
import { Sensor, SensorStatus } from '../../types';
import './SensorList.css';

const SensorList: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [filterStatus, setFilterStatus] = useState<SensorStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'lastUpdate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    loadSensors();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadSensors, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSensors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSensors: Sensor[] = [
        {
          id: '1',
          name: 'Freezer A1',
          location: 'Kitchen - North Wall',
          type: 'temperature_humidity' as any,
          status: SensorStatus.ONLINE,
          battery: 85,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          lastReading: {
            id: 'reading-1',
            sensorId: '1',
            temperature: -18.5,
            humidity: 65,
            timestamp: new Date().toISOString(),
            quality: 'excellent' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          configuration: {
            readingInterval: 300,
            temperatureRange: { min: -25, max: -15 },
            humidityRange: { min: 50, max: 80 },
            alerts: {
              temperatureAlert: true,
              humidityAlert: true,
              batteryAlert: true,
              offlineAlert: true,
              thresholds: {
                temperatureMin: -25,
                temperatureMax: -15,
                humidityMin: 50,
                humidityMax: 80,
                batteryMin: 20
              }
            }
          }
        },
        {
          id: '2',
          name: 'Freezer B2',
          location: 'Kitchen - South Wall',
          type: 'temperature_humidity' as any,
          status: SensorStatus.ONLINE,
          battery: 92,
          createdAt: '2024-01-16T11:00:00Z',
          updatedAt: '2024-01-20T14:25:00Z',
          lastReading: {
            id: 'reading-2',
            sensorId: '2',
            temperature: -20.1,
            humidity: 62,
            timestamp: new Date().toISOString(),
            quality: 'excellent' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          configuration: {
            readingInterval: 300,
            temperatureRange: { min: -25, max: -15 },
            humidityRange: { min: 50, max: 80 },
            alerts: {
              temperatureAlert: true,
              humidityAlert: true,
              batteryAlert: true,
              offlineAlert: true,
              thresholds: {
                temperatureMin: -25,
                temperatureMax: -15,
                humidityMin: 50,
                humidityMax: 80,
                batteryMin: 20
              }
            }
          }
        },
        {
          id: '3',
          name: 'Cold Room Main',
          location: 'Storage Area - Central',
          type: 'multi_sensor' as any,
          status: SensorStatus.WARNING,
          battery: 45,
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-20T14:20:00Z',
          lastReading: {
            id: 'reading-3',
            sensorId: '3',
            temperature: 4.2,
            humidity: 78,
            pressure: 1013.25,
            timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
            quality: 'good' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          configuration: {
            readingInterval: 180,
            temperatureRange: { min: 2, max: 8 },
            humidityRange: { min: 60, max: 85 },
            alerts: {
              temperatureAlert: true,
              humidityAlert: true,
              batteryAlert: true,
              offlineAlert: true,
              thresholds: {
                temperatureMin: 2,
                temperatureMax: 8,
                humidityMin: 60,
                humidityMax: 85,
                batteryMin: 20
              }
            }
          }
        },
        {
          id: '4',
          name: 'Outdoor Sensor',
          location: 'External - Loading Dock',
          type: 'temperature_humidity' as any,
          status: SensorStatus.OFFLINE,
          battery: 15,
          createdAt: '2024-01-12T08:00:00Z',
          updatedAt: '2024-01-19T16:45:00Z',
          lastReading: {
            id: 'reading-4',
            sensorId: '4',
            temperature: 12.8,
            humidity: 85,
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            quality: 'poor' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          configuration: {
            readingInterval: 600,
            temperatureRange: { min: -10, max: 40 },
            humidityRange: { min: 30, max: 95 },
            alerts: {
              temperatureAlert: false,
              humidityAlert: false,
              batteryAlert: true,
              offlineAlert: true,
              thresholds: {
                temperatureMin: -10,
                temperatureMax: 40,
                humidityMin: 30,
                humidityMax: 95,
                batteryMin: 20
              }
            }
          }
        }
      ];
      
      setSensors(mockSensors);
    } catch (err) {
      setError('Failed to load sensors. Please try again.');
      console.error('Error loading sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort sensors
  const filteredAndSortedSensors = sensors
    .filter(sensor => {
      const matchesStatus = filterStatus === 'all' || sensor.status === filterStatus;
      const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastUpdate':
          aValue = new Date(a.lastReading?.timestamp || a.updatedAt).getTime();
          bValue = new Date(b.lastReading?.timestamp || b.updatedAt).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: 'name' | 'status' | 'lastUpdate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'name' | 'status' | 'lastUpdate') => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '⬆️' : '⬇️';
  };

  const getStatusCounts = () => {
    return {
      all: sensors.length,
      online: sensors.filter(s => s.status === SensorStatus.ONLINE).length,
      offline: sensors.filter(s => s.status === SensorStatus.OFFLINE).length,
      warning: sensors.filter(s => s.status === SensorStatus.WARNING).length,
      error: sensors.filter(s => s.status === SensorStatus.ERROR).length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <Loading message="Loading sensors..." />;
  }

  if (error) {
    return (
      <div className="sensors-error">
        <h2>❌ Error Loading Sensors</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadSensors}>
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="sensors-page">
      {selectedSensor ? (
        <SensorDetails 
          sensor={selectedSensor} 
          onBack={() => setSelectedSensor(null)}
        />
      ) : (
        <>
          <div className="sensors-header">
            <div className="sensors-title">
              <h2>📡 Sensor Management</h2>
              <p>Monitor and manage all IoT sensors</p>
            </div>
            
            <div className="sensors-stats">
              <div className="stat-item">
                <span className="stat-value">{statusCounts.all}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item stat-online">
                <span className="stat-value">{statusCounts.online}</span>
                <span className="stat-label">Online</span>
              </div>
              <div className="stat-item stat-warning">
                <span className="stat-value">{statusCounts.warning}</span>
                <span className="stat-label">Warning</span>
              </div>
              <div className="stat-item stat-offline">
                <span className="stat-value">{statusCounts.offline}</span>
                <span className="stat-label">Offline</span>
              </div>
            </div>
          </div>

          <div className="sensors-controls">
            <div className="controls-left">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search sensors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-box">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as SensorStatus | 'all')}
                  className="filter-select"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value={SensorStatus.ONLINE}>🟢 Online ({statusCounts.online})</option>
                  <option value={SensorStatus.WARNING}>🟡 Warning ({statusCounts.warning})</option>
                  <option value={SensorStatus.OFFLINE}>🔴 Offline ({statusCounts.offline})</option>
                  <option value={SensorStatus.ERROR}>❌ Error ({statusCounts.error})</option>
                </select>
              </div>
            </div>

            <div className="controls-right">
              <div className="sort-controls">
                <button
                  className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </button>
                <button
                  className={`sort-btn ${sortBy === 'status' ? 'active' : ''}`}
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </button>
                <button
                  className={`sort-btn ${sortBy === 'lastUpdate' ? 'active' : ''}`}
                  onClick={() => handleSort('lastUpdate')}
                >
                  Updated {getSortIcon('lastUpdate')}
                </button>
              </div>
              
              <button className="btn btn-primary">
                ➕ Add Sensor
              </button>
            </div>
          </div>

          <div className="sensors-content">
            {filteredAndSortedSensors.length === 0 ? (
              <div className="no-sensors">
                <h3>📭 No Sensors Found</h3>
                <p>
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No sensors match your current filters.'
                    : 'No sensors have been added yet.'
                  }
                </p>
                {(searchTerm || filterStatus !== 'all') && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="sensors-grid">
                {filteredAndSortedSensors.map(sensor => (
                  <SensorCard
                    key={sensor.id}
                    sensor={sensor}
                    onClick={() => setSelectedSensor(sensor)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SensorList;