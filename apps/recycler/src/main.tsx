import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { RecyclerAuthProvider } from './context/RecyclerAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecyclerAuthProvider>
      <App />
    </RecyclerAuthProvider>
  </React.StrictMode>
);
