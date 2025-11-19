import { Suspense, lazy } from 'react';
import { createBrowserRouter, redirect, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

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

const SuspenseFallback = () => {
  return <div>Loading...</div>;
};

/**
 * 모든 보호된 라우트에 공통으로 적용되는 인증 체크 loader
 */
const protectedRouteLoader = () => {
  // 추후 토큰 인증 로직 추가
  const token = localStorage.getItem('access_token');
  if (!token) {
    return redirect(ROUTES.LOGIN.path);
  }
  return null;
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
  {
    // 모든 보호된 라우트의 부모 라우트
    loader: protectedRouteLoader,
    element: <Outlet />,
    children: [
      {
        path: ROUTES.ROOT.path,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <MainPage />
          </Suspense>
        ),
      },
    ],
  },
]);
