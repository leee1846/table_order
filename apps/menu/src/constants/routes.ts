export const ROUTES = {
  ROOT: {
    path: '/',
    generate: () => '/',
  },
  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },
} as const;
