export const ROUTES = {
  ROOT: {
    path: '/',
    generate: () => '/',
  },

  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },

  TABLES: {
    path: 'tables',
    generate: () => '/tables',
  },

  SETTINGS: {
    path: '/settings',

    MISCELLANEOUS: {
      path: 'misc',
      generate: () => '/settings/misc',
    },
  },
} as const;
