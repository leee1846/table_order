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
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from './constants/keys';
import App from './App';

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
 * 로그인 여부 확인 loader
 */
const authCheckerLoader = () => {
  const token = getAccessToken();
  if (!token) {
    return redirect(ROUTES.LOGIN.generate());
  }
  return null;
};

/**
 * 관리자 페이지 접근을 위한 비밀번호 인증 상태 확인 loader
 */
const adminVerificationCheckLoader = async () => {
  const data = await AppStorage.loadData<boolean>({
    key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
  });
  const isVerified = data?.value ?? false;

  if (!isVerified) {
    window.location.replace(ROUTES.ROOT.generate());
    return null;
  }
  return null;
};

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.LOGIN.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        /**
         * 토큰 여부를 확인하기 위한 loader
         * 로그인 페이지를 제외한 모든 페이지에서 확인
         * */
        loader: authCheckerLoader,
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
            /**
             * 관리자 페이지 접근을 위한 비밀번호 인증 상태를 확인하기 위한 loader
             * 메인 페이지를 제외한 모든 페이지에서 확인
             * */
            loader: adminVerificationCheckLoader,
            element: <Outlet />,
            children: [
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
                      <Navigate
                        to={ROUTES.SETTINGS.MISCELLANEOUS.path}
                        replace
                      />
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
        ],
      },
    ],
  },
]);
