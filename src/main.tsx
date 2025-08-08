import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Set initial theme from localStorage before React renders
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)