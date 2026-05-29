import {
  createBrowserRouter,
  redirect,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { getAccessToken } from '@repo/api/auth';
import { saveAppLog } from '@repo/util/app';
import {
  removeMenuboardToken,
  getMenuboardToken,
} from '@/feature/MenuboardAuth';
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
 * 관리자 모드 접근 토큰 보유 여부 확인
 * menuboardToken이 없으면 ROOT로 이동 처리 (선택한 테이블이 없으면 자동으로 관리자모드 비밀번호 입력 UI노출됨)
 */
const adminVerificationCheckLoader = () => {
  if (!getMenuboardToken()) {
    return redirect(ROUTES.ROOT.generate());
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
        shouldRevalidate: () => true,
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
            shouldRevalidate: () => true,
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

/**
 * 이전 페이지 경로를 추적
 * subscribe 최초 호출(앱 초기 진입) 시에는 null로 기록
 */
let prevPathname: string | null = null;

/**
 * - 'idle': 이동 완료 후 state.location이 실제 이동된 페이지 → 기록
 */
router.subscribe((state) => {
  if (state.navigation.state === 'idle') {
    const targetPath = state.location.pathname;

    // login 또는 root 페이지로 이동 시 menuboard 토큰 제거
    if (targetPath === ROUTES.LOGIN.path || targetPath === ROUTES.ROOT.path) {
      removeMenuboardToken();
    }

    saveAppLog('[페이지 이동]', {
      from: prevPathname,
      to: targetPath,
      search: state.location.search,
    });
    prevPathname = targetPath;
  }
});
