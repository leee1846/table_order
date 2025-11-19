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

    MISCELLANEOUS: {
      path: 'misc',
      generate: () => '/settings/misc',
    },
  },
} as const;
