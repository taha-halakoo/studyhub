import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// SECURITY: Unregister any existing service workers to ensure no offline caching
// This strictly enforces the "Online Only" requirement
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);