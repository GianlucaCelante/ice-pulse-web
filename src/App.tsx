import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Dashboard from './components/dashboard/Dashboard';
import SensorList from './components/sensors/SensorList';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useApi } from './hooks/useApi';

type CurrentView = 'dashboard' | 'sensors' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const { apiStatus, checkApiHealth } = useApi();

  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'sensors':
        return <SensorList />;
      case 'settings':
        return <div className="view-container">
          <h2>⚙️ Settings</h2>
          <p>Settings panel coming soon...</p>
        </div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          apiStatus={apiStatus}
        />
        
        <main className="main-content">
          {renderCurrentView()}
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;