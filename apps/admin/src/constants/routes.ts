export const ROUTES = {
  SETTINGS: {
    path: '/settings',

    CATEGORIES: {
      path: 'categories',
      generate: () => '/settings/categories',
    },
    CATEGORY_MENUS: {
      path: 'categories/:id/menus',
      generate: (id: string | number) => `/settings/categories/${id}/menus`,
    },
  },
  ORDERS: {
    path: '/orders',
  },
} as const;
