import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { getAccessToken } from '@repo/api/auth';
import App from '@/App';
import type { ITokenPayload } from '@repo/api/types';
import { decodeJwtToken } from '@repo/util/function';
import { CapacitorApp } from '@repo/util/app';
import { StoresPage } from './pages/webAdmin/StoresPage';
import { SalesAccessGuard } from '@/feature/SalesAccessGuard';

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  }))
);
const SettingSidebar = lazy(() =>
  import('@/pages/settings/SidebarLayout').then((module) => ({
    default: module.SidebarLayout,
  }))
);
const SettingsAccessGuard = lazy(() =>
  import('@/pages/settings/SettingsAccessGuard').then((module) => ({
    default: module.SettingsAccessGuard,
  }))
);
const StoresSidebar = lazy(() =>
  import('@/feature/AdminWeb/SidebarLayout').then((module) => ({
    default: module.StoresSidebarLayout,
  }))
);
const StoreNewPage = lazy(() =>
  import('@/pages/webAdmin/StoreNewPage').then((module) => ({
    default: module.StoreNewPage,
  }))
);
const StoreEditPage = lazy(() =>
  import('@/pages/webAdmin/StoreEditPage').then((module) => ({
    default: module.StoreEditPage,
  }))
);
const NoticesPage = lazy(() =>
  import('@/pages/settings/NoticesPage').then((module) => ({
    default: module.NoticesPage,
  }))
);
const NoticeDetailPage = lazy(() =>
  import('@/pages/settings/NoticeDetailPage').then((module) => ({
    default: module.NoticeDetailPage,
  }))
);
const CategoriesPage = lazy(() =>
  import('@/pages/settings/CategoriesPage').then((module) => ({
    default: module.CategoriesPage,
  }))
);
const CategoryMenusPage = lazy(() =>
  import('@/pages/settings/CategoryMenusPage').then((module) => ({
    default: module.CategoryMenusPage,
  }))
);
const TablesPage = lazy(() =>
  import('@/pages/TablesPage').then((module) => ({
    default: module.TablesPage,
  }))
);

const TableDetailPage = lazy(() =>
  import('@/pages/TableDetailPage').then((module) => ({
    default: module.TableDetailPage,
  }))
);
const SalesSummaryPage = lazy(() =>
  import('@/pages/settings/SalesSummaryPage').then((module) => ({
    default: module.SalesSummaryPage,
  }))
);
const SalesOrderPage = lazy(() =>
  import('@/pages/settings/SalesOrderPage').then((module) => ({
    default: module.SalesOrderPage,
  }))
);
const SalesCardPage = lazy(() =>
  import('@/pages/settings/SalesCardPage').then((module) => ({
    default: module.SalesCardPage,
  }))
);
// const SalesCashPage = lazy(() =>
//   import('@/pages/settings/SalesCashPage').then((module) => ({
//     default: module.SalesCashPage,
//   }))
// );
const SalesMenuPage = lazy(() =>
  import('@/pages/settings/SalesMenuPage').then((module) => ({
    default: module.SalesMenuPage,
  }))
);

const SettingsTablesPage = lazy(() =>
  import('@/pages/settings/TablesPage').then((module) => ({
    default: module.TablesPage,
  }))
);

const MiscellaneousPage = lazy(() =>
  import('@/pages/settings/MiscellaneousPage').then((module) => ({
    default: module.MiscellaneousPage,
  }))
);
const MyPage = lazy(() =>
  import('@/pages/settings/MyPage').then((module) => ({
    default: module.MyPage,
  }))
);

const StartScreenPage = lazy(() =>
  import('@/pages/settings/StartScreenPage').then((module) => ({
    default: module.StartScreenPage,
  }))
);
const MenuScreenPage = lazy(() =>
  import('@/pages/settings/MenuScreenPage').then((module) => ({
    default: module.MenuScreenPage,
  }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  }))
);
const AdminMyPage = lazy(() =>
  import('@/pages/webAdmin/AdminMyPage').then((module) => ({
    default: module.AdminMyPage,
  }))
);
const AppHistoryPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoryPage').then((module) => ({
    default: module.AppHistoryPage,
  }))
);
const AppHistoryNewPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoryNewPage').then((module) => ({
    default: module.AppHistoryNewPage,
  }))
);
const AppHistoryEditPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoryEditPage').then((module) => ({
    default: module.AppHistoryEditPage,
  }))
);
const AppHistoryDetailPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoryDetailPage').then((module) => ({
    default: module.AppHistoryDetailPage,
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

/**
 * 로그인 페이지 전용 loader
 * 이미 로그인된 사용자는 role에 따라 적절한 페이지로 리디렉트
 */
const loginPageLoader = () => {
  const token = getAccessToken();
  if (!token) {
    // 토큰이 없으면 로그인 페이지를 보여줌 (redirect 없음)
    return null;
  }

  // 토큰 디코딩
  const payload = decodeJwtToken<ITokenPayload>(token);
  if (!payload) {
    // 토큰이 유효하지 않으면 로그인 페이지를 보여줌
    return null;
  }

  // 이미 로그인된 사용자는 role에 따라 적절한 페이지로 리디렉트
  if (payload.role === 'SHOP') {
    if (CapacitorApp.isNative()) {
      return redirect(ROUTES.TABLES.generate());
    }
    return redirect(ROUTES.SETTINGS.NOTICES.generate());
  }

  if (!CapacitorApp.isNative()) {
    return redirect(ROUTES.ADMIN_WEB.STORES.generate());
  }

  return redirect(ROUTES.NOT_FOUND.generate());
};

/**
 * 루트 경로에서 role에 따라 리디렉트하는 loader
 */
const rootRouteLoader = () => {
  const token = getAccessToken();
  if (!token) {
    return redirect(ROUTES.LOGIN.generate());
  }

  // 토큰 디코딩
  const payload = decodeJwtToken<ITokenPayload>(token);
  if (!payload) {
    return redirect(ROUTES.LOGIN.generate());
  }

  if (payload.role === 'SHOP') {
    if (CapacitorApp.isNative()) {
      return redirect(ROUTES.TABLES.generate());
    }
    return redirect(ROUTES.SETTINGS.NOTICES.generate());
  }

  if (!CapacitorApp.isNative()) {
    return redirect(ROUTES.ADMIN_WEB.STORES.generate());
  }

  return redirect(ROUTES.NOT_FOUND.generate());
};

const onlyNativePageLoader = () => {
  if (!CapacitorApp.isNative()) {
    return redirect(ROUTES.NOT_FOUND.generate());
  }

  return null;
};

/**
 * Admin Web 경로에서 native일 경우 404로 리디렉트하는 loader
 */
const onlyWebPageLoader = () => {
  if (CapacitorApp.isNative()) {
    return redirect(ROUTES.NOT_FOUND.generate());
  }

  return null;
};

/**
 * Admin Web 경로에서 Web 체크와 ADMIN 권한 체크를 모두 수행하는 loader
 */
const adminWebPageLoader = () => {
  // Admin 권한 체크
  const token = getAccessToken();
  if (!token) {
    return redirect(ROUTES.LOGIN.generate());
  }

  // 토큰 디코딩
  const payload = decodeJwtToken<ITokenPayload>(token);
  if (!payload) {
    return redirect(ROUTES.LOGIN.generate());
  }

  // SHOP 역할은 접근 불가
  if (payload.role === 'SHOP') {
    return redirect(ROUTES.NOT_FOUND.generate());
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
    loader: loginPageLoader,
  },

  {
    loader: protectedRouteLoader,
    element: <App />,
    children: [
      {
        // 루트 경로 → role에 따라 리디렉트
        path: '/',
        loader: rootRouteLoader,
      },

      {
        path: ROUTES.ADMIN_WEB.path,
        loader: onlyWebPageLoader,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <StoresSidebar />
          </Suspense>
        ),
        children: [
          {
            index: true,
            loader: adminWebPageLoader,
            element: (
              <Navigate to={ROUTES.ADMIN_WEB.STORES.generate()} replace />
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.STORES.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <StoresPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.STORES_NEW.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <StoreNewPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.STORES_EDIT.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <StoreEditPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.MYPAGE.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <AdminMyPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.APP_HISTORY.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <AppHistoryPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.APP_HISTORY_NEW.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <AppHistoryNewPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.APP_HISTORY_EDIT.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <AppHistoryEditPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ADMIN_WEB.APP_HISTORY_DETAIL.path,
            loader: adminWebPageLoader,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <AppHistoryDetailPage />
              </Suspense>
            ),
          },
        ],
      },

      {
        // /tables
        path: ROUTES.TABLES.path,
        loader: onlyNativePageLoader,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <TablesPage />
          </Suspense>
        ),
      },
      {
        // /tables/:tableNum
        path: ROUTES.TABLE_DETAIL.path,
        loader: onlyNativePageLoader,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <TableDetailPage />
          </Suspense>
        ),
      },

      {
        path: ROUTES.SETTINGS.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <SettingsAccessGuard>
              <SettingSidebar />
            </SettingsAccessGuard>
          </Suspense>
        ),
        children: [
          {
            // /settings → /settings/categories
            index: true,
            element: <Navigate to={ROUTES.SETTINGS.CATEGORIES.path} replace />,
          },
          {
            path: ROUTES.SETTINGS.NOTICES.path,
            element: <NoticesPage />,
          },
          {
            path: ROUTES.SETTINGS.NOTICES.DETAIL.path,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <NoticeDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SETTINGS.CATEGORIES.path,
            element: <CategoriesPage />,
          },
          {
            // /settings/categories/:id → 바로 menus로 리디렉트
            path: `${ROUTES.SETTINGS.CATEGORIES.path}/:id`,
            loader: ({ params }) =>
              redirect(ROUTES.SETTINGS.CATEGORY_MENUS.generate(params.id!)),
          },
          {
            path: ROUTES.SETTINGS.CATEGORY_MENUS.path,
            element: <CategoryMenusPage />,
          },
          {
            path: ROUTES.SETTINGS.SALES.path,
            element: (
              <SalesAccessGuard>
                <Outlet />
              </SalesAccessGuard>
            ),
            children: [
              {
                index: true,
                loader: () =>
                  redirect(ROUTES.SETTINGS.SALES.SUMMARY.generate()),
              },
              {
                path: ROUTES.SETTINGS.SALES.SUMMARY.path,
                element: <SalesSummaryPage />,
              },
              {
                path: ROUTES.SETTINGS.SALES.ORDER.path,
                element: <SalesOrderPage />,
              },
              {
                path: ROUTES.SETTINGS.SALES.CARD.path,
                element: <SalesCardPage />,
              },
              // {
              //   path: ROUTES.SETTINGS.SALES.CASH.path,
              //   element: <SalesCashPage />,
              // },
              {
                path: ROUTES.SETTINGS.SALES.MENU.path,
                element: <SalesMenuPage />,
              },
            ],
          },
          {
            path: ROUTES.SETTINGS.THEME.path,
            element: <Outlet />,
            children: [
              {
                index: true,
                loader: () =>
                  redirect(ROUTES.SETTINGS.THEME.START_SCREEN.generate()),
              },
              {
                path: ROUTES.SETTINGS.THEME.START_SCREEN.path,
                element: <StartScreenPage />,
              },
              {
                path: ROUTES.SETTINGS.THEME.MENU_SCREEN.path,
                element: <MenuScreenPage />,
              },
            ],
          },
          {
            path: ROUTES.SETTINGS.MISCELLANEOUS.path,
            element: <MiscellaneousPage />,
          },
          {
            path: ROUTES.SETTINGS.MYPAGE.path,
            element: (
              <Suspense fallback={<FullscreenLoadingSpinner />}>
                <MyPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTES.SETTINGS.TABLES.generate(),
        loader: onlyNativePageLoader,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <SettingsTablesPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.NOT_FOUND.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
