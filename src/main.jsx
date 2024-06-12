import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// React query
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// Analytics
import { Analytics } from '@vercel/analytics/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Analytics />
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>

  // <>
  //   <Analytics />
  //   <App />
  // </>

  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
);
