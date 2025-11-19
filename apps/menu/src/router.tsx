import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  redirect,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { FullscreenLoadingSpinner } from '@repo/ui/components';

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
  // 추후 토큰 인증 로직 추가
  const token = localStorage.getItem('access_token');
  if (token) {
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
