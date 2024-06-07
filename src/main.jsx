import React from 'react';
import ReactDOM from 'react-dom/client';
//import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';

//import './index.css'

// Analytics
import { Analytics } from '@vercel/analytics/react';

// Trying routing with components instead
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <ErrorPage />,
//     // children: [
//     //   {
//     //     path: 'louvre',
//     //     element: <Louvre />,
//     //   },
//     // ],
//   },
//   {
//     path: 'louvre',
//     element: <Louvre />,
//     errorElement: <ErrorPage />,
//     // children: [
//     //   {
//     //     path: 'louvre',
//     //     element: <Louvre />,
//     //   },
//     // ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Analytics />
    {/* <RouterProvider router={router} /> */}
    <App />
  </>

  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
);
