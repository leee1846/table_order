export const ROUTES = {
  HOME: {
    path: '/',
  },
  ABOUT: {
    path: '/about',
  },
  USER_PROFILE: {
    path: '/users/:userId',
    generate: (userId: string | number) => `/users/${userId}`,
  },
} as const;
