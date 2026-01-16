import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  type LoaderFunctionArgs,
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

// ============================================================================
// Lazy Loaded Components - Auth & Layout
// ============================================================================
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
  import('@/feature/SettingsAccessGuard').then((module) => ({
    default: module.SettingsAccessGuard,
  }))
);
const StoresSidebar = lazy(() =>
  import('@/feature/AdminWeb/SidebarLayout').then((module) => ({
    default: module.StoresSidebarLayout,
  }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  }))
);

// ============================================================================
// Lazy Loaded Components - Admin Web Pages
// ============================================================================
const StoresNewPage = lazy(() =>
  import('@/pages/webAdmin/StoresNewPage').then((module) => ({
    default: module.StoresNewPage,
  }))
);
const StoresEditPage = lazy(() =>
  import('@/pages/webAdmin/StoresEditPage').then((module) => ({
    default: module.StoresEditPage,
  }))
);
const AdminMyPage = lazy(() =>
  import('@/pages/webAdmin/AdminMyPage').then((module) => ({
    default: module.AdminMyPage,
  }))
);
const AppHistoriesPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoriesPage').then((module) => ({
    default: module.AppHistoriesPage,
  }))
);
const AppHistoriesNewPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoriesNewPage').then((module) => ({
    default: module.AppHistoriesNewPage,
  }))
);
const AppHistoriesEditPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoriesEditPage').then((module) => ({
    default: module.AppHistoriesEditPage,
  }))
);
const AppHistoriesDetailPage = lazy(() =>
  import('@/pages/webAdmin/AppHistoriesDetailPage').then((module) => ({
    default: module.AppHistoriesDetailPage,
  }))
);
const AdminNoticesPage = lazy(() =>
  import('@/pages/webAdmin/NoticesPage').then((module) => ({
    default: module.NoticesPage,
  }))
);
const NoticesNewPage = lazy(() =>
  import('@/pages/webAdmin/NoticesNewPage').then((module) => ({
    default: module.NoticesNewPage,
  }))
);
const NoticesEditPage = lazy(() =>
  import('@/pages/webAdmin/NoticesEditPage').then((module) => ({
    default: module.NoticesEditPage,
  }))
);
const NoticesDetailPage = lazy(() =>
  import('@/pages/webAdmin/NoticesDetailPage').then((module) => ({
    default: module.NoticesDetailPage,
  }))
);
const MembersPage = lazy(() =>
  import('@/pages/webAdmin/MembersPage').then((module) => ({
    default: module.MembersPage,
  }))
);
const MembersNewPage = lazy(() =>
  import('@/pages/webAdmin/MembersNewPage').then((module) => ({
    default: module.MembersNewPage,
  }))
);
const MembersEditPage = lazy(() =>
  import('@/pages/webAdmin/MembersEditPage').then((module) => ({
    default: module.MembersEditPage,
  }))
);

const DailySalesPage = lazy(() =>
  import('@/pages/settings/DailySalesPage').then((module) => ({
    default: module.DailySalesPage,
  }))
);

const DailySalesHistoryPage = lazy(() =>
  import('@/pages/settings/DailySalesHistoryPage').then((module) => ({
    default: module.DailySalesHistoryPage,
  }))
);
const MenuSalesHistoryPage = lazy(() =>
  import('@/pages/settings/MenuSalesHistoryPage').then((module) => ({
    default: module.MenuSalesHistoryPage,
  }))
);
const SalesReportPage = lazy(() =>
  import('@/pages/settings/SalesReportPage').then((module) => ({
    default: module.SalesReportPage,
  }))
);
const CalendarSalesPage = lazy(() =>
  import('@/pages/settings/CalendarSalesPage').then((module) => ({
    default: module.CalendarSalesPage,
  }))
);

const HourlySalesPage = lazy(() =>
  import('@/pages/settings/HourlySalesPage').then((module) => ({
    default: module.HourlySalesPage,
  }))
);

// ============================================================================
// Lazy Loaded Components - Native App Pages
// ============================================================================
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
const SettingsTablesPage = lazy(() =>
  import('@/pages/settings/TablesPage').then((module) => ({
    default: module.TablesPage,
  }))
);

// ============================================================================
// Lazy Loaded Components - Settings Pages
// ============================================================================
const MyPage = lazy(() =>
  import('@/pages/settings/MyPage').then((module) => ({
    default: module.MyPage,
  }))
);

const NoticesPage = lazy(() =>
  import('@/pages/settings/NoticesPage').then((module) => ({
    default: module.NoticesPage,
  }))
);
const SettingsNoticeDetailPage = lazy(() =>
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
const MiscellaneousPage = lazy(() =>
  import('@/pages/settings/MiscellaneousPage').then((module) => ({
    default: module.MiscellaneousPage,
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

// ============================================================================
// Helper Functions - Token & Payload
// ============================================================================

/**
 * 토큰에서 페이로드를 추출하고 검증합니다.
 * @returns 토큰 페이로드 또는 null
 */
const getTokenPayload = (): ITokenPayload | null => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return decodeJwtToken<ITokenPayload>(token);
};

/**
 * 사용자 역할과 플랫폼에 따라 적절한 페이지로 리디렉트합니다.
 * @param payload - 토큰 페이로드
 * @returns 리디렉트 응답
 */
const redirectByUserRole = (payload: ITokenPayload) => {
  const isNative = CapacitorApp.isNative();
  const isShopRole = payload.role === 'SHOP';

  // 사장님 권한
  if (isShopRole) {
    // 사장님 권한 && App(태블릿)일 경우 테이블 페이지로 리디렉트
    if (isNative) {
      return redirect(ROUTES.TABLES.generate());
    }
    // 사장님 권한 && Web(데스크탑)일 경우 공지사항 페이지로 리디렉트
    return redirect(ROUTES.SETTINGS.NOTICES.generate());
  }

  // 관리자 권한 && Web(데스크탑)일 경우 매장목록 페이지로 리디렉트
  if (!isNative) {
    return redirect(ROUTES.ADMIN_WEB.STORES.generate());
  }

  // 권한 없음 → 404 페이지로 리디렉트
  return redirect(ROUTES.NOT_FOUND.generate());
};

// ============================================================================
// Route Loaders
// ============================================================================

/**
 * 모든 보호된 라우트에 공통으로 적용되는 인증 체크 loader
 */
const checkAuthenticationLoader = () => {
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
  const payload = getTokenPayload();
  if (!payload) {
    // 토큰이 없거나 유효하지 않으면 로그인 페이지를 보여줌 (redirect 없음)
    return null;
  }

  return redirectByUserRole(payload);
};

/**
 * 루트 경로에서 role에 따라 리디렉트하는 loader
 */
const rootRouteLoader = () => {
  const payload = getTokenPayload();
  if (!payload) {
    // 토큰이 없거나 유효하지 않으면 로그인 페이지로 리디렉트
    return redirect(ROUTES.LOGIN.generate());
  }

  return redirectByUserRole(payload);
};

/**
 * Native 앱에서만 접근 가능한 페이지를 위한 loader
 */
const requireNativeLoader = () => {
  if (!CapacitorApp.isNative()) {
    return redirect(ROUTES.NOT_FOUND.generate());
  }
  return null;
};

/**
 * Admin Web 경로에서 native일 경우 404로 리디렉트하는 loader
 */
const requireWebLoader = () => {
  if (CapacitorApp.isNative()) {
    return redirect(ROUTES.NOT_FOUND.generate());
  }
  return null;
};

/**
 * Admin Web 경로에서 Web 체크와 ADMIN 권한 체크를 모두 수행하는 loader
 */
const requireAdminWebLoader = () => {
  const payload = getTokenPayload();
  if (!payload) {
    return redirect(ROUTES.LOGIN.generate());
  }

  // SHOP 역할은 접근 불가
  if (payload.role === 'SHOP') {
    return redirect(ROUTES.NOT_FOUND.generate());
  }

  return null;
};

/**
 * MASTER 권한만 접근 가능한 페이지를 위한 loader
 */
const requireMasterLoader = () => {
  const payload = getTokenPayload();
  if (!payload) {
    return redirect(ROUTES.LOGIN.generate());
  }

  // MASTER 역할만 접근 가능
  if (payload.role !== 'MASTER') {
    return redirect(ROUTES.NOT_FOUND.generate());
  }

  return null;
};

// ============================================================================
// Route Configuration Helpers
// ============================================================================

/**
 * Suspense로 감싼 lazy 컴포넌트를 생성합니다.
 */
const createLazyRoute = (
  Component: React.LazyExoticComponent<React.ComponentType<unknown>>
) => (
  <Suspense fallback={<FullscreenLoadingSpinner />}>
    <Component />
  </Suspense>
);

/**
 * Suspense로 감싼 일반 컴포넌트를 생성합니다.
 */
const createRoute = (Component: React.ComponentType) => (
  <Suspense fallback={<FullscreenLoadingSpinner />}>
    <Component />
  </Suspense>
);

// ============================================================================
// Route Configuration
// ============================================================================

/**
 * Admin Web 라우트 설정
 */
const createAdminWebRoutes = () => [
  {
    index: true,
    loader: requireAdminWebLoader,
    element: <Navigate to={ROUTES.ADMIN_WEB.STORES.generate()} replace />,
  },
  {
    path: ROUTES.ADMIN_WEB.STORES.path,
    loader: requireAdminWebLoader,
    element: createRoute(StoresPage),
  },
  {
    path: ROUTES.ADMIN_WEB.STORES_NEW.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(StoresNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.STORES_EDIT.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(StoresEditPage),
  },
  {
    path: ROUTES.ADMIN_WEB.MYPAGE.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AdminMyPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORIES.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoriesPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORIES_NEW.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoriesNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORIES_EDIT.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoriesEditPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORIES_DETAIL.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoriesDetailPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AdminNoticesPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES_NEW.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(NoticesNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES_EDIT.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(NoticesEditPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES_DETAIL.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(NoticesDetailPage),
  },
  {
    path: ROUTES.ADMIN_WEB.MEMBERS.path,
    loader: requireMasterLoader,
    element: createLazyRoute(MembersPage),
  },
  {
    path: ROUTES.ADMIN_WEB.MEMBERS_NEW.path,
    loader: requireMasterLoader,
    element: createLazyRoute(MembersNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.MEMBERS_EDIT.path,
    loader: requireMasterLoader,
    element: createLazyRoute(MembersEditPage),
  },
];

/**
 * Settings 라우트 설정
 */
const createSettingsRoutes = () => [
  {
    // /settings → /settings/categories
    index: true,
    element: <Navigate to={ROUTES.SETTINGS.CATEGORIES.path} replace />,
  },
  {
    path: ROUTES.SETTINGS.MYPAGE.path,
    loader: requireWebLoader,
    element: (
      <Suspense fallback={<FullscreenLoadingSpinner />}>
        <MyPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SETTINGS.NOTICES.path,
    element: <NoticesPage />,
  },
  {
    path: ROUTES.SETTINGS.CATEGORIES.path,
    element: <CategoriesPage />,
  },
  {
    // /settings/categories/:id → 바로 menus로 리디렉트
    path: `${ROUTES.SETTINGS.CATEGORIES.path}/:id`,
    loader: ({ params }: LoaderFunctionArgs) =>
      redirect(ROUTES.SETTINGS.CATEGORY_MENUS.generate(params.id as string)),
  },
  {
    path: ROUTES.SETTINGS.CATEGORY_MENUS.path,
    element: <CategoryMenusPage />,
  },
  {
    path: ROUTES.SETTINGS.NOTICES.DETAIL.path,
    element: (
      <Suspense fallback={<FullscreenLoadingSpinner />}>
        <SettingsNoticeDetailPage />
      </Suspense>
    ),
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
        loader: () => {
          if (CapacitorApp.isNative()) {
            return redirect(ROUTES.SETTINGS.SALES.SUMMARY.generate());
          }
          return redirect(ROUTES.SETTINGS.SALES.SALES_DAILY.generate());
        },
      },
      {
        path: ROUTES.SETTINGS.SALES.SUMMARY.path, //매출요약(앱)
        element: <SalesSummaryPage />,
        loader: requireNativeLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.ORDER.path, //주문내역 (앱)
        element: <SalesOrderPage />,
        loader: requireNativeLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.CARD.path, // 카드승인내역 (앱)
        element: <SalesCardPage />,
        loader: requireNativeLoader,
      },
      // {
      //   path: ROUTES.SETTINGS.SALES.CASH.path,
      //   element: <SalesCashPage />,
      // },
      {
        path: ROUTES.SETTINGS.SALES.MENU.path, //메뉴판매집계(앱)
        element: <SalesMenuPage />,
        loader: requireNativeLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_DAILY.path, //당일매출 (웹)
        element: <DailySalesPage />,
        loader: requireWebLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_DAILY_HISTORY.path, //일별매출내역 (웹)
        element: <DailySalesHistoryPage />,
        loader: requireWebLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_HOURLY.path, //시간대별매출내역 (웹)
        element: <HourlySalesPage />,
        loader: requireWebLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.MENU_HISTORY.path, //메뉴별매출내역 (웹)
        element: <MenuSalesHistoryPage />,
        loader: requireWebLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_CALENDAR.path, //달력매출내역 (웹)
        element: <CalendarSalesPage />,
        loader: requireWebLoader,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_REPORT.path, //매출 리포트 (웹)
        element: <SalesReportPage />,
        loader: requireWebLoader,
      },
    ],
  },
  {
    path: ROUTES.SETTINGS.THEME.path,
    element: <Outlet />,
    children: [
      {
        index: true,
        loader: () => redirect(ROUTES.SETTINGS.THEME.START_SCREEN.generate()),
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
];

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN.path,
    element: createLazyRoute(LoginPage),
    loader: loginPageLoader,
  },
  {
    loader: checkAuthenticationLoader,
    element: <App />,
    children: [
      {
        // 루트 경로 → role에 따라 리디렉트
        path: '/',
        loader: rootRouteLoader,
      },
      {
        path: ROUTES.ADMIN_WEB.path,
        loader: requireWebLoader,
        element: createLazyRoute(StoresSidebar),
        children: createAdminWebRoutes(),
      },
      {
        // /tables
        path: ROUTES.TABLES.path,
        loader: requireNativeLoader,
        element: createLazyRoute(TablesPage),
      },
      {
        // /tables/:tableNum
        path: ROUTES.TABLE_DETAIL.path,
        loader: requireNativeLoader,
        element: createLazyRoute(TableDetailPage),
      },
      {
        path: ROUTES.SETTINGS.path,
        element: (
          <Suspense fallback={<FullscreenLoadingSpinner />}>
            <SettingsAccessGuard>
              <Outlet />
            </SettingsAccessGuard>
          </Suspense>
        ),
        children: [
          {
            path: '',
            element: <SettingSidebar />,
            children: createSettingsRoutes(),
          },
          {
            path: ROUTES.SETTINGS.TABLES.path,
            loader: requireNativeLoader,
            element: createLazyRoute(SettingsTablesPage),
          },
        ],
      },
      {
        path: ROUTES.NOT_FOUND.path,
        element: createLazyRoute(NotFoundPage),
      },
      {
        // 존재하지 않는 모든 경로를 404 페이지로 리디렉트
        path: '*',
        element: createLazyRoute(NotFoundPage),
      },
    ],
  },
]);
