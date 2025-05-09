import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>  {/* Wrap the App component with Router */}
    <App />
  </Router>
);
