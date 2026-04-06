export const ROUTES = {
  LOGIN: {
    path: '/login',
    generate: () => '/login',
  },

  ROOT: {
    path: '/',
    generate: () => '/',
  },

  BACKOFFICE: {
    path: '/backoffice',
    generate: () => '/backoffice',

    STORES: {
      path: 'stores',
      generate: () => '/backoffice/stores',
    },
    STORES_NEW: {
      path: 'stores/new',
      generate: () => '/backoffice/stores/new',
    },
    STORES_EDIT: {
      path: 'stores/:shopCode/edit',
      generate: (shopCode: string) => `/backoffice/stores/${shopCode}/edit`,
    },
    MYPAGE: {
      path: 'mypage',
      generate: () => '/backoffice/mypage',
    },
    APP_HISTORIES: {
      path: 'app-histories',
      generate: () => '/backoffice/app-histories',
    },
    APP_HISTORIES_NEW: {
      path: 'app-histories/new',
      generate: () => '/backoffice/app-histories/new',
    },
    APP_HISTORIES_EDIT: {
      path: 'app-histories/:id/edit',
      generate: (id: string | number) => `/backoffice/app-histories/${id}/edit`,
    },
    APP_HISTORIES_DETAIL: {
      path: 'app-histories/:id',
      generate: (id: string | number) => `/backoffice/app-histories/${id}`,
    },
    NOTICES: {
      path: 'notices',
      generate: () => '/backoffice/notices',
    },
    NOTICES_NEW: {
      path: 'notices/new',
      generate: () => '/backoffice/notices/new',
    },
    NOTICES_EDIT: {
      path: 'notices/:id/edit',
      generate: (id: string | number) => `/backoffice/notices/${id}/edit`,
    },
    NOTICES_DETAIL: {
      path: 'notices/:id',
      generate: (id: string | number) => `/backoffice/notices/${id}`,
    },
    MEMBERS: {
      path: 'members',
      generate: () => '/backoffice/members',
    },
    MEMBERS_NEW: {
      path: 'members/new',
      generate: () => '/backoffice/members/new',
    },
    MEMBERS_EDIT: {
      path: 'members/:memberId/edit',
      generate: (memberId: string) => `/backoffice/members/${memberId}/edit`,
    },
    MEMBERS_DETAIL: {
      path: 'members/:memberId',
      generate: (memberId: string) => `/backoffice/members/${memberId}`,
    },
    CAMPAIGN: {
      path: 'campaign',
      generate: () => `/backoffice/campaign`,
    },
    CAMPAIGN_NEW: {
      path: 'campaign/new',
      generate: () => `/backoffice/campaign/new`,
    },
    CAMPAIGN_EDIT: {
      path: '/backoffice/campaign/edit/:id', // 라우터에 등록할 때 사용할 path
      generate: (id: string | number) => `/backoffice/campaign/edit/${id}`, // 페이지 이동 시 사용할 함수
    },
    MENU_GROUP: {
      path: 'menu-group',
      generate: () => `/backoffice/menu-group`,
    },
    STORE_GROUP: {
      path: 'store-groups',
      generate: () => `/backoffice/store-groups`,
    },
    STORE_GROUP_NEW: {
      path: '/backoffice/store-groups/new',
      generate: () => '/backoffice/store-groups/new',
    },
    STORE_GROUP_EDIT: {
      path: '/backoffice/store-groups/:id',
      generate: (id: string | number) => `/backoffice/store-groups/${id}`,
    },
    MENU_GROUP_STATUS: {
      path: 'menu-group-status',
      generate: () => `/backoffice/menu-group-status`,
    },
  },

  SETTINGS: {
    path: '/settings',

    NOTICES: {
      path: 'notices',
      generate: () => '/settings/notices',
      DETAIL: {
        path: 'notices/:noticeSeq',
        generate: (noticeSeq: string | number) =>
          `/settings/notices/${noticeSeq}`,
      },
    },
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
      CARD: {
        path: 'card',
        generate: () => '/settings/sales/card',
      },
      CASH: {
        path: 'cash',
        generate: () => '/settings/sales/cash',
      },
      MENU: {
        path: 'menu',
        generate: () => '/settings/sales/menu',
      },
      MENU_HISTORY: {
        path: 'menu-history',
        generate: () => '/settings/sales/menu-history',
      },
      SALES_DAILY: {
        path: 'daily',
        generate: () => '/settings/sales/daily',
      },
      SALES_DAILY_HISTORY: {
        path: 'daily-history',
        generate: () => '/settings/sales/daily-history',
      },
      SALES_HOURLY: {
        path: 'hourly',
        generate: () => '/settings/sales/hourly',
      },
      SALES_CALENDAR: {
        path: 'calendar',
        generate: () => '/settings/sales/calendar',
      },
      SALES_REPORT: {
        path: 'report',
        generate: () => '/settings/sales/report',
      },
    },
    DEVICE_MANAGEMENT: {
      path: 'device-management',
      generate: () => '/settings/device-management',
    },
    TABLES: {
      path: 'tables',
      generate: () => '/settings/tables',
    },
    MENU_SCREEN: {
      path: 'menu-screen',
      generate: () => '/settings/menu-screen',
    },
    START_SCREEN: {
      path: 'start-screen',

      THEME: {
        path: 'theme',
        generate: () => '/settings/start-screen/theme',
      },
      LOGO: {
        path: 'logo',
        generate: () => '/settings/start-screen/logo',
      },
      IMAGE_REGISTRATION: {
        path: 'image-registration',
        generate: () => '/settings/start-screen/image-registration',
      },
    },
    MISCELLANEOUS: {
      path: 'misc',
      generate: () => '/settings/misc',
    },
    MYPAGE: {
      path: 'myPage',
      generate: () => '/settings/myPage',
    },
  },
  TABLES: {
    path: '/tables',
    generate: () => '/tables',
  },
  TABLE_DETAIL: {
    path: '/tables/:tableNum',
    generate: (tableNum: string | number) => `/tables/${tableNum}`,
  },
  NOT_FOUND: {
    path: '/404',
    generate: () => '/404',
  },
} as const;
