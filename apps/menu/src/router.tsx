import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  redirect,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { getAccessToken } from '@repo/api/auth';

const MainPage = lazy(() =>
  import('@/pages/MainPage').then((module) => ({
    default: module.MainPage,
  }))
);
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  }))
);
const TablesPage = lazy(() =>
  import('@/pages/TablesPage').then((module) => ({
    default: module.TablesPage,
  }))
);
const SidebarLayout = lazy(() =>
  import('@/pages/settings/SidebarLayout').then((module) => ({
    default: module.SidebarLayout,
  }))
);
const MiscellaneousPage = lazy(() =>
  import('@/pages/settings/MiscellaneousPage').then((module) => ({
    default: module.MiscellaneousPage,
  }))
);

/**
 * 모든 보호된 라우트에 공통으로 적용되는 인증 체크 loader
 */
const protectedRouteLoader = () => {
  const token = getAccessToken();
  if (!token) {
    return redirect(ROUTES.LOGIN.path);
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN.path,
    element: (
      <Suspense fallback={<FullscreenLoadingSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    // 모든 보호된 라우트의 부모 라우트
    loader: protectedRouteLoader,
    element: <Outlet />,
    children: [
      {
        path: ROUTES.ROOT.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.TABLES.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <TablesPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.SETTINGS.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <SidebarLayout />
          </Suspense>
        ),
        children: [
          {
            // /settings → /settings/misc
            index: true,
            element: (
              <Navigate to={ROUTES.SETTINGS.MISCELLANEOUS.path} replace />
            ),
          },
          {
            path: ROUTES.SETTINGS.MISCELLANEOUS.path,
            element: <MiscellaneousPage />,
          },
        ],
      },
    ],
  },
]);
