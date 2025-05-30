import React from 'react';
import './Header.css';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'sensors' | 'settings') => void;
  apiStatus: 'connected' | 'disconnected' | 'loading';
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, apiStatus }) => {
  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return '🟢';
      case 'disconnected':
        return '🔴';
      case 'loading':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">
            🧊 Ice Pulse
          </h1>
          <span className="header-subtitle">IoT Dashboard</span>
        </div>
        
        <nav className="header-nav">
          <button 
            className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-button ${currentView === 'sensors' ? 'active' : ''}`}
            onClick={() => onViewChange('sensors')}
          >
            📡 Sensors
          </button>
          <button 
            className={`nav-button ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => onViewChange('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
        
        <div className="header-status">
          <span className="status-indicator">
            {getStatusIcon()} API {apiStatus}
          </span>
          <span className="env-badge">
            {process.env.NODE_ENV}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;