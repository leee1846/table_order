export const ROUTES = {
  ROOT: {
    path: '/',
    generate: () => '/',
  },
  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },
  SETTINGS: {
    path: '/settings',

    TABLES: {
      path: 'tables',
      generate: () => '/settings/tables',
    },

    MISCELLANEOUS: {
      path: 'misc',
      generate: () => '/settings/misc',
    },
  },
} as const;
