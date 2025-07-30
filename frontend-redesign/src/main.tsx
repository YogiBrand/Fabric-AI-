import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // Temporarily disabled StrictMode to debug WebSocket issues
  // <StrictMode>
    <App />
  // </StrictMode>
);
