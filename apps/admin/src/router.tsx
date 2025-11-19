import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { FullscreenLoadingSpinner } from '@repo/ui/components';

const SettingSidebar = lazy(() =>
  import('@/pages/settings/SidebarLayout').then((module) => ({
    default: module.SidebarLayout,
  }))
);
const NoticesPage = lazy(() =>
  import('@/pages/settings/NoticesPage').then((module) => ({
    default: module.NoticesPage,
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
const SalesCashPage = lazy(() =>
  import('@/pages/settings/SalesCashPage').then((module) => ({
    default: module.SalesCashPage,
  }))
);
const SalesMenuPage = lazy(() =>
  import('@/pages/settings/SalesMenuPage').then((module) => ({
    default: module.SalesMenuPage,
  }))
);
const StylePage = lazy(() =>
  import('@/pages/settings/StylePage').then((module) => ({
    default: module.StylePage,
  }))
);
const MiscellaneousPage = lazy(() =>
  import('@/pages/settings/MiscellaneousPage').then((module) => ({
    default: module.MiscellaneousPage,
  }))
);

export const router = createBrowserRouter([
  {
    // 루트 경로 → /tables로 리디렉트
    path: '/',
    element: <Navigate to={ROUTES.TABLES.path} replace />,
  },
  {
    // /tables
    path: ROUTES.TABLES.path,
    element: (
      <Suspense fallback={<FullscreenLoadingSpinner />}>
        <TablesPage />
      </Suspense>
    ),
  },
  {
    // /tables/:tableNum
    path: ROUTES.TABLE_DETAIL.path,
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
        <SettingSidebar />
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
        element: <Outlet />,
        children: [
          {
            index: true,
            loader: () => redirect(ROUTES.SETTINGS.SALES.SUMMARY.generate()),
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
          {
            path: ROUTES.SETTINGS.SALES.CASH.path,
            element: <SalesCashPage />,
          },
          {
            path: ROUTES.SETTINGS.SALES.MENU.path,
            element: <SalesMenuPage />,
          },
        ],
      },
      {
        path: ROUTES.SETTINGS.STYLE.path,
        element: <StylePage />,
      },
      {
        path: ROUTES.SETTINGS.MISCELLANEOUS.path,
        element: <MiscellaneousPage />,
      },
    ],
  },
]);
