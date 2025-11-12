import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, redirect } from 'react-router-dom';
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
const OrdersPage = lazy(() =>
  import('@/pages/OrdersPage').then((module) => ({
    default: module.OrdersPage,
  }))
);

export const router = createBrowserRouter([
  {
    // 루트 경로 → /orders로 리디렉트
    path: '/',
    element: <Navigate to={ROUTES.ORDERS.path} replace />,
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
    ],
  },
  {
    path: ROUTES.ORDERS.path,
    element: (
      <Suspense>
        <OrdersPage />
      </Suspense>
    ),
  },
]);
