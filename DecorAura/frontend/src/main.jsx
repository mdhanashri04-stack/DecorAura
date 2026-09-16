import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/global.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
if (!window.location.hash || window.location.hash === '#') {
  window.scrollTo(0, 0);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
