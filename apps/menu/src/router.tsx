import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const LoginPage = lazy(() => import('@/pages/LoginPage'));

const SuspenseFallback = () => {
  return <div>Loading...</div>;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN.path,
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
]);
