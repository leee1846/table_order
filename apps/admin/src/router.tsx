import type { ComponentType } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  type LoaderFunctionArgs,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { getAccessToken } from '@repo/api/auth';
import App from '@/App';
import type { ITokenPayload } from '@repo/api/types';
import { decodeJwtToken } from '@repo/util/function';
import { CapacitorApp } from '@repo/util/app';
import { StoresPage } from '@/pages/backoffice/StoresPage';
import { SalesAccessGuard } from '@/feature/SalesAccessGuard';
import { LoginPage } from '@/pages/LoginPage';
import { SidebarLayout as SettingSidebar } from '@/pages/settings/SidebarLayout';
import { SettingsAccessGuard } from '@/feature/SettingsAccessGuard';
import { StoresSidebarLayout as StoresSidebar } from '@/feature/backoffice/SidebarLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { StoresNewPage } from '@/pages/backoffice/StoresNewPage';
import { StoresEditPage } from '@/pages/backoffice/StoresEditPage';
import { AdminMyPage } from '@/pages/backoffice/AdminMyPage';
import { AppHistoriesPage } from '@/pages/backoffice/AppHistoriesPage';
import { AppHistoriesNewPage } from '@/pages/backoffice/AppHistoriesNewPage';
import { AppHistoriesEditPage } from '@/pages/backoffice/AppHistoriesEditPage';
import { AppHistoriesDetailPage } from '@/pages/backoffice/AppHistoriesDetailPage';
import { NoticesPage as AdminNoticesPage } from '@/pages/backoffice/NoticesPage';
import { NoticesNewPage } from '@/pages/backoffice/NoticesNewPage';
import { NoticesEditPage } from '@/pages/backoffice/NoticesEditPage';
import { NoticesDetailPage } from '@/pages/backoffice/NoticesDetailPage';
import { MembersPage } from '@/pages/backoffice/MembersPage';
import { MembersNewPage } from '@/pages/backoffice/MembersNewPage';
import { MembersEditPage } from '@/pages/backoffice/MembersEditPage';
import { DailySalesPage } from '@/pages/settings/DailySalesPage';
import { DailySalesHistoryPage } from '@/pages/settings/DailySalesHistoryPage';
import { MenuSalesHistoryPage } from '@/pages/settings/MenuSalesHistoryPage';
import { SalesReportPage } from '@/pages/settings/SalesReportPage';
import { CalendarSalesPage } from '@/pages/settings/CalendarSalesPage';
import { HourlySalesPage } from '@/pages/settings/HourlySalesPage';
import { TablesPage } from '@/pages/TablesPage';
import { TableDetailPage } from '@/pages/TableDetailPage';
import { TablesPage as SettingsTablesPage } from '@/pages/settings/TablesPage';
import { MyPage } from '@/pages/settings/MyPage';
import { NoticesPage } from '@/pages/settings/NoticesPage';
import { NoticeDetailPage as SettingsNoticeDetailPage } from '@/pages/settings/NoticeDetailPage';
import { CategoriesPage } from '@/pages/settings/CategoriesPage';
import { CategoryMenusPage } from '@/pages/settings/CategoryMenusPage';
import { SalesSummaryPage } from '@/pages/settings/SalesSummaryPage';
import { SalesOrderPage } from '@/pages/settings/SalesOrderPage';
import { SalesCardPage } from '@/pages/settings/SalesCardPage';
import { SalesMenuPage } from '@/pages/settings/SalesMenuPage';
import { MiscellaneousPage } from '@/pages/settings/MiscellaneousPage';
import { DeviceManagementPage } from '@/pages/settings/DeviceManagementPage';
import { MenuScreenPage } from '@/pages/settings/MenuScreenPage';
import { StartScreenThemePage } from '@/pages/settings/StartScreenThemePage';
import { StartScreenLogoPage } from '@/pages/settings/StartScreenLogoPage';
import { StartScreenImageRegistrationPage } from '@/pages/settings/StartScreenImageRegistrationPage';
import CampaignPage from '@/pages/backoffice/CampaignPage';
import CampaignNewPage from '@/pages/backoffice/CampaignNewPage';
import MenuGroupPage from '@/pages/backoffice/MenuGroupPage';
import { StoreGroupPage } from '@/pages/backoffice/StoreGroupPage';
import { StoreGroupNewPage } from '@/pages/backoffice/StoreGroupNewPage';
import MenuTagStatus from '@/pages/backoffice/MenuTagStatus';
import { MembersDetailPage } from '@/pages/backoffice/MembersDetailPage';

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
    return redirect(ROUTES.BACKOFFICE.STORES.generate());
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
 * Backoffice 경로에서 native일 경우 404로 리디렉트하는 loader
 */
const requireWebLoader = () => {
  if (CapacitorApp.isNative()) {
    return redirect(ROUTES.NOT_FOUND.generate());
  }
  return null;
};

/**
 * Backoffice 경로에서 Web 체크와 ADMIN 권한 체크를 모두 수행하는 loader
 */
const requireBackofficeLoader = () => {
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
 * 라우트용 컴포넌트를 생성합니다.
 */
const createRoute = (Component: ComponentType) => <Component />;

// ============================================================================
// Route Configuration
// ============================================================================

/**
 * Admin Web 라우트 설정
 */
const createBackofficeRoutes = () => [
  {
    index: true,
    loader: requireBackofficeLoader,
    element: <Navigate to={ROUTES.BACKOFFICE.STORES.generate()} replace />,
  },
  {
    path: ROUTES.BACKOFFICE.STORES.path,
    loader: requireBackofficeLoader,
    element: createRoute(StoresPage),
  },
  {
    path: ROUTES.BACKOFFICE.STORES_NEW.path,
    loader: requireBackofficeLoader,
    element: createRoute(StoresNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.STORES_EDIT.path,
    loader: requireBackofficeLoader,
    element: createRoute(StoresEditPage),
  },
  {
    path: ROUTES.BACKOFFICE.MYPAGE.path,
    loader: requireBackofficeLoader,
    element: createRoute(AdminMyPage),
  },
  {
    path: ROUTES.BACKOFFICE.APP_HISTORIES.path,
    loader: requireBackofficeLoader,
    element: createRoute(AppHistoriesPage),
  },
  {
    path: ROUTES.BACKOFFICE.APP_HISTORIES_NEW.path,
    loader: requireBackofficeLoader,
    element: createRoute(AppHistoriesNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.APP_HISTORIES_EDIT.path,
    loader: requireBackofficeLoader,
    element: createRoute(AppHistoriesEditPage),
  },
  {
    path: ROUTES.BACKOFFICE.APP_HISTORIES_DETAIL.path,
    loader: requireBackofficeLoader,
    element: createRoute(AppHistoriesDetailPage),
  },
  {
    path: ROUTES.BACKOFFICE.NOTICES.path,
    loader: requireBackofficeLoader,
    element: createRoute(AdminNoticesPage),
  },
  {
    path: ROUTES.BACKOFFICE.NOTICES_NEW.path,
    loader: requireBackofficeLoader,
    element: createRoute(NoticesNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.NOTICES_EDIT.path,
    loader: requireBackofficeLoader,
    element: createRoute(NoticesEditPage),
  },
  {
    path: ROUTES.BACKOFFICE.NOTICES_DETAIL.path,
    loader: requireBackofficeLoader,
    element: createRoute(NoticesDetailPage),
  },
  {
    path: ROUTES.BACKOFFICE.MEMBERS.path,
    loader: requireMasterLoader,
    element: createRoute(MembersPage),
  },
  {
    path: ROUTES.BACKOFFICE.MEMBERS_NEW.path,
    loader: requireMasterLoader,
    element: createRoute(MembersNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.MEMBERS_EDIT.path,
    loader: requireMasterLoader,
    element: createRoute(MembersEditPage),
  },
  {
    path: ROUTES.BACKOFFICE.MEMBERS_DETAIL.path,
    loader: requireMasterLoader,
    element: createRoute(MembersDetailPage),
  },
  {
    path: ROUTES.BACKOFFICE.CAMPAIGN.path,
    loader: requireMasterLoader,
    element: createRoute(CampaignPage),
  },
  {
    path: ROUTES.BACKOFFICE.CAMPAIGN_NEW.path,
    loader: requireMasterLoader,
    element: createRoute(CampaignNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.CAMPAIGN_EDIT.path,
    loader: requireMasterLoader,
    element: createRoute(CampaignNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.MENU_GROUP.path,
    loader: requireMasterLoader,
    element: createRoute(MenuGroupPage),
  },
  {
    path: ROUTES.BACKOFFICE.STORE_GROUP.path,
    loader: requireMasterLoader,
    element: createRoute(StoreGroupPage),
  },
  {
    path: ROUTES.BACKOFFICE.STORE_GROUP_NEW.path,
    loader: requireBackofficeLoader,
    element: createRoute(StoreGroupNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.STORE_GROUP_EDIT.path,
    loader: requireBackofficeLoader,
    element: createRoute(StoreGroupNewPage),
  },
  {
    path: ROUTES.BACKOFFICE.MENU_GROUP_STATUS.path,
    loader: requireBackofficeLoader, // 권한 체크 (ADMIN, MASTER만 접근 가능하도록)
    element: createRoute(MenuTagStatus),
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
    element: <MyPage />,
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
    element: <SettingsNoticeDetailPage />,
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
    path: ROUTES.SETTINGS.MENU_SCREEN.path,
    element: <MenuScreenPage />,
  },
  {
    path: ROUTES.SETTINGS.START_SCREEN.path,
    element: <Outlet />,
    children: [
      {
        index: true,
        loader: () => redirect(ROUTES.SETTINGS.START_SCREEN.THEME.generate()),
      },
      {
        path: ROUTES.SETTINGS.START_SCREEN.THEME.path,
        element: <StartScreenThemePage />,
      },
      {
        path: ROUTES.SETTINGS.START_SCREEN.LOGO.path,
        element: <StartScreenLogoPage />,
      },
      {
        path: ROUTES.SETTINGS.START_SCREEN.IMAGE_REGISTRATION.path,
        element: <StartScreenImageRegistrationPage />,
      },
    ],
  },
  {
    path: ROUTES.SETTINGS.MISCELLANEOUS.path,
    element: <MiscellaneousPage />,
  },
  {
    path: ROUTES.SETTINGS.DEVICE_MANAGEMENT.path,
    loader: requireWebLoader,
    element: <DeviceManagementPage />,
  },
];

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.LOGIN.path,
        element: createRoute(LoginPage),
        loader: loginPageLoader,
      },
      {
        loader: checkAuthenticationLoader,
        element: <Outlet />,
        children: [
          {
            // 루트 경로 → role에 따라 리디렉트
            path: '/',
            loader: rootRouteLoader,
          },
          {
            path: ROUTES.BACKOFFICE.path,
            loader: requireWebLoader,
            element: createRoute(StoresSidebar),
            children: createBackofficeRoutes(),
          },
          {
            // /tables
            path: ROUTES.TABLES.path,
            loader: requireNativeLoader,
            element: createRoute(TablesPage),
          },
          {
            // /tables/:tableNum
            path: ROUTES.TABLE_DETAIL.path,
            loader: requireNativeLoader,
            element: createRoute(TableDetailPage),
          },
          {
            path: ROUTES.SETTINGS.path,
            element: (
              <SettingsAccessGuard>
                <Outlet />
              </SettingsAccessGuard>
            ),
            children: [
              {
                path: '',
                element: <SettingSidebar />,
                children: createSettingsRoutes(),
              },
              {
                path: ROUTES.SETTINGS.TABLES.path,
                element: createRoute(SettingsTablesPage),
              },
            ],
          },
          {
            path: ROUTES.NOT_FOUND.path,
            element: createRoute(NotFoundPage),
          },
          {
            // 존재하지 않는 모든 경로를 404 페이지로 리디렉트
            path: '*',
            element: createRoute(NotFoundPage),
          },
        ],
      },
    ],
  },
]);
