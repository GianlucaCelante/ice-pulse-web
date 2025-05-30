import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🧊 Ice Pulse Web</h1>
        <p>
          Monitoring Dashboard - Environment: <code>{process.env.NODE_ENV}</code>
        </p>
        <div style={{ marginTop: '20px' }}>
          <a
            className="App-link"
            href={process.env.REACT_APP_API_URL || 'http://localhost:8080'}
            target="_blank"
            rel="noopener noreferrer"
          >
            📡 API Server
          </a>
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          <p>✅ React app is running!</p>
          <p>🔄 Auto-deploy with Watchtower enabled</p>
        </div>
      </header>
    </div>
  );
}

export default App;