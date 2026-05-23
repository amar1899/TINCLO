import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TestRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>Routing Test Component</h3>
      <p>Current path: <strong>{location.pathname}</strong></p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button onClick={() => handleNavigation('/')}>
          Go to Landing
        </button>
        <button onClick={() => handleNavigation('/signup')}>
          Go to Signup
        </button>
        <button onClick={() => handleNavigation('/jobs')}>
          Go to Jobs
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: 'white', borderRadius: '5px' }}>
        <p><strong>Debug Info:</strong></p>
        <pre>{JSON.stringify({ pathname: location.pathname, search: location.search }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestRouting;
