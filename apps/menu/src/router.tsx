import {
  createBrowserRouter,
  redirect,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { getAccessToken } from '@repo/api/auth';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from './constants/keys';
import App from './App';
import { MainPage } from '@/pages/MainPage';
import { LoginPage } from '@/pages/LoginPage';
import { TablesPage } from '@/pages/TablesPage';
import { SidebarLayout } from '@/pages/settings/SidebarLayout';
import { MiscellaneousPage } from '@/pages/settings/MiscellaneousPage';
import { PaymentsCardsPage } from '@/pages/settings/PaymentsCardsPage';
import { TableDetailPage } from '@/pages/TableDetailPage';
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
        element: <LoginPage />,
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
            element: <MainPage />,
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
                element: <TablesPage />,
              },
              {
                path: ROUTES.TABLES.TABLE_DETAIL.path,
                element: <TableDetailPage />,
              },
              {
                path: ROUTES.SETTINGS.path,
                element: <SidebarLayout />,
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
                  {
                    path: ROUTES.SETTINGS.PAYMENTS_CARDS.path,
                    element: <PaymentsCardsPage />,
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
