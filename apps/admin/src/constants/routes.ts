export const ROUTES = {
  ORDERS: {
    path: '/orders',
  },
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
    SALES: {
      path: 'sales',

      SUMMARY: {
        path: 'summary',
        generate: () => '/settings/sales/summary',
      },
      ORDER: {
        path: 'order',
        generate: () => '/settings/sales/order',
      },
    },
  },
} as const;
