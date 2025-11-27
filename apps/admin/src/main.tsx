import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeModeProvider, DynamicThemeProvider } from '@repo/ui';
import { ToastMessage } from '@repo/ui/components';
import { GlobalDialogContainer } from '@repo/feature/components';
import { QueryProvider } from '@/config/QueryProvider';
import { router } from '@/router';
import '@/config/api';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeModeProvider appType="admin">
        <DynamicThemeProvider>
          <RouterProvider router={router} />
          <GlobalDialogContainer />
          <ToastMessage visibleToasts={1} />
        </DynamicThemeProvider>
      </ThemeModeProvider>
    </QueryProvider>
  </StrictMode>
);
