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

const SuspenseFallback = () => {
  return <div>Loading...</div>;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.SETTINGS.path,
    element: (
      <Suspense fallback={<SuspenseFallback />}>
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
          <Suspense fallback={<SuspenseFallback />}>
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
          <Suspense fallback={<SuspenseFallback />}>
            <CategoryMenusPage />
          </Suspense>
        ),
      },
    ],
  },
]);
