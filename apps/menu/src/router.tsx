import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const MainPage = lazy(() =>
  import('@/pages/MainPage').then((module) => ({
    default: module.MainPage,
  }))
);

const SuspenseFallback = () => {
  return <div>Loading...</div>;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT.path,
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <MainPage />
      </Suspense>
    ),
  },
]);
