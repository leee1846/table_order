import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ROUTES } from '@/constants/routes';
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
);
const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then((module) => ({ default: module.AboutPage }))
);
const UserProfilePage = lazy(() =>
  import('@/pages/UserProfilePage').then((module) => ({
    default: module.UserProfilePage,
  }))
);

const SuspenseFallback = () => {
  return <div>Loading...</div>;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME.path,
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ABOUT.path,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.USER_PROFILE.path,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <UserProfilePage />
          </Suspense>
        ),
      },
    ],
  },
]);
