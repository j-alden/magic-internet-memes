import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
//import './index.css'

// Analytics
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Analytics />
    <App />
  </>

  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
);
