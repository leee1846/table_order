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
  import('@/pages/settings/SettingsAccessGuard').then((module) => ({
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
const AdminNoticesPage = lazy(() =>
  import('@/pages/webAdmin/NoticePage').then((module) => ({
    default: module.AdminNoticesPage,
  }))
);
const NoticeNewPage = lazy(() =>
  import('@/pages/webAdmin/NoticeNewPage').then((module) => ({
    default: module.NoticeNewPage,
  }))
);
const NoticeEditPage = lazy(() =>
  import('@/pages/webAdmin/NoticeEditPage').then((module) => ({
    default: module.NoticeEditPage,
  }))
);
const NoticeDetailPage = lazy(() =>
  import('@/pages/webAdmin/NoticeDetailPage').then((module) => ({
    default: module.NoticeDetailPage,
  }))
);
const AdminManagePage = lazy(() =>
  import('@/pages/webAdmin/AdminManagePage').then((module) => ({
    default: module.AdminManagePage,
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
    element: createLazyRoute(StoreNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.STORES_EDIT.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(StoreEditPage),
  },
  {
    path: ROUTES.ADMIN_WEB.MYPAGE.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AdminMyPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORY.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoryPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORY_NEW.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoryNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORY_EDIT.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoryEditPage),
  },
  {
    path: ROUTES.ADMIN_WEB.APP_HISTORY_DETAIL.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AppHistoryDetailPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(AdminNoticesPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES_NEW.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(NoticeNewPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES_EDIT.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(NoticeEditPage),
  },
  {
    path: ROUTES.ADMIN_WEB.NOTICES_DETAIL.path,
    loader: requireAdminWebLoader,
    element: createLazyRoute(NoticeDetailPage),
  },
  {
    path: ROUTES.ADMIN_WEB.ADMIN_MANAGE.path,
    loader: requireMasterLoader,
    element: createLazyRoute(AdminManagePage),
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
        loader: () => redirect(ROUTES.SETTINGS.SALES.SUMMARY.generate()),
      },
      {
        path: ROUTES.SETTINGS.SALES.SUMMARY.path, //매출요약(앱)
        element: <SalesSummaryPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.ORDER.path, //주문내역 (앱)
        element: <SalesOrderPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.CARD.path, // 카드승인내역 (앱)
        element: <SalesCardPage />,
      },
      // {
      //   path: ROUTES.SETTINGS.SALES.CASH.path,
      //   element: <SalesCashPage />,
      // },
      {
        path: ROUTES.SETTINGS.SALES.MENU.path, //메뉴판매집계(앱)
        element: <SalesMenuPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_DAILY.path, //당일매출 (웹)
        element: <DailySalesPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_DAILY_HISTORY.path, //일별매출내역 (웹)
        element: <DailySalesHistoryPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_HOURLY.path, //시간대별매출내역 (웹)
        element: <HourlySalesPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.MENU_HISTORY.path, //메뉴별매출내역 (웹)
        element: <MenuSalesHistoryPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_CALENDAR.path, //달력매출내역 (웹)
        element: <CalendarSalesPage />,
      },
      {
        path: ROUTES.SETTINGS.SALES.SALES_REPORT.path, //매출 리포트 (웹)
        element: <SalesReportPage />,
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
              <SettingSidebar />
            </SettingsAccessGuard>
          </Suspense>
        ),
        children: createSettingsRoutes(),
      },
      {
        path: ROUTES.SETTINGS.TABLES.generate(),
        loader: requireNativeLoader,
        element: createLazyRoute(SettingsTablesPage),
      },
      {
        path: ROUTES.NOT_FOUND.path,
        element: createLazyRoute(NotFoundPage),
      },
    ],
  },
]);
