import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeModeProvider, DynamicThemeProvider } from '@repo/ui';
import { GlobalDialogContainer, ToastMessage } from '@repo/feature/components';
import { QueryProvider } from '@/config/QueryProvider';
import { router } from '@/router';
import '@/config/api';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeModeProvider>
        <DynamicThemeProvider>
          <RouterProvider router={router} />
          <GlobalDialogContainer />
          <ToastMessage />
        </DynamicThemeProvider>
      </ThemeModeProvider>
    </QueryProvider>
  </StrictMode>
);
