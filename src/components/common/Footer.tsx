import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const buildTime = process.env.REACT_APP_BUILD_TIME || new Date().toISOString();
  const version = process.env.REACT_APP_VERSION || '1.0.0';

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>🧊 Ice Pulse</h4>
          <p>IoT Temperature Monitoring System</p>
        </div>
        
        <div className="footer-section">
          <h4>📊 System Info</h4>
          <p>Version: {version}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Built: {new Date(buildTime).toLocaleString()}</p>
        </div>
        
        <div className="footer-section">
          <h4>🔗 Links</h4>
          <a href={process.env.REACT_APP_API_URL || 'http://localhost:8080'} target="_blank" rel="noopener noreferrer">
            API Server
          </a>
          <a href="/health" target="_blank" rel="noopener noreferrer">
            Health Check
          </a>
        </div>
        
        <div className="footer-section">
          <h4>📡 Status</h4>
          <div className="status-indicators">
            <span className="status-item">
              🟢 Web App
            </span>
            <span className="status-item">
              🔄 Auto Deploy
            </span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Ice Pulse System. Built with Docker + React.</p>
      </div>
    </footer>
  );
};

export default Footer;