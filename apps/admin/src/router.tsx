import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
} from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const SettingSidebar = lazy(() =>
  import('@/components/settings/SidebarLayout').then((module) => ({
    default: module.SidebarLayout,
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
const TestPage = lazy(() =>
  import('@/pages/TestPage').then((module) => ({
    default: module.TestPage,
  }))
);

export const router = createBrowserRouter([
  {
    // 루트 경로 → /tables로 리디렉트
    path: '/',
    element: <Navigate to={ROUTES.TABLES.path} replace />,
  },
  {
    path: ROUTES.SETTINGS.path,
    element: (
      <Suspense>
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
        path: ROUTES.SETTINGS.CATEGORIES.path,
        element: (
          <Suspense>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        // /settings/categories/:id → 바로 menus로 리디렉트
        path: `${ROUTES.SETTINGS.CATEGORIES.path}/:id`,
        loader: ({ params }) =>
          redirect(ROUTES.SETTINGS.CATEGORY_MENUS.generate(params.id!)),
      },
      {
        path: ROUTES.SETTINGS.CATEGORY_MENUS.path,
        element: (
          <Suspense>
            <CategoryMenusPage />
          </Suspense>
        ),
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
            element: (
              <Suspense>
                <SalesSummaryPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    // /tables
    path: ROUTES.TABLES.path,
    element: (
      <Suspense>
        <TablesPage />
      </Suspense>
    ),
  },
  {
    // /tables/:tableNum
    path: ROUTES.TABLE_DETAIL.path,
    element: (
      <Suspense>
        <TableDetailPage />
      </Suspense>
    ),
  },
  {
    // /tables/:tableNum
    path: '/test',
    element: (
      <Suspense>
        <TestPage />
      </Suspense>
    ),
  },
]);
