import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@repo/ui';
import { ToastMessage } from '@repo/ui/components';
import { QueryProvider } from '@/config/QueryProvider';
import { router } from '@/router';
import '@/config/api';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <ToastMessage visibleToasts={1} />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
