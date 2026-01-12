/**
 * API 엔드포인트 상수들을 정의합니다.
 */
export const ENDPOINTS = {
  COMMON: {
    HOLIDAYS: '/holidays',
  },

  APP: {
    LATEST_VERSION: (type: string) => `/app/version/latest/${type}`,
  },

  AUTH: {
    LOGIN: '/login',
    TOKEN_REFRESH: '/token/refresh',
    LOGIN_MENUBOARD_ADMIN: '/login/menuboard',
    LOGIN_SALES: '/login/sales',
  },

  ORDER: {
    SEND_PICKUP_NOTIFICATION: '/orders/pickup-notification',
    PICKUP: (shopCode: string, tableNumber: string) =>
      `/order/pickup/${shopCode}/${tableNumber}`,
    CREATE_ORDER_GROUP: (shopCode: string, tableNumber: string) =>
      `/order-group/${shopCode}/${tableNumber}`,
    CREATE_TABLE_ORDER: (shopCode: string, tableNumber: string) =>
      `/order/${shopCode}/${tableNumber}`,
    TABLE_ORDER_HISTORY: (shopCode: string, tableNumber: string) =>
      `/order/${shopCode}/${tableNumber}`,
    CURRENT_TABLE_LIST: (shopCode: string) => `/order/${shopCode}`,
    CANCEL_MENU: '/order/cancel/menu',
    CANCEL_ALL: (shopCode: string, tableNumber: string) =>
      `/order/cancel/${shopCode}/${tableNumber}`,
    MOVE_ORDER_GROUP: (shopCode: string) => `/order/move/${shopCode}`,
    SHARE_ORDER_GROUP: (shopCode: string) => `/order/share/${shopCode}`,
    CLEAR_ORDER: (shopCode: string, tableNumber: string) =>
      `/order/clear/${shopCode}/${tableNumber}`,
    CUSTOM_AMOUNT: '/order/custom-amount',
    ORDER_LOG_LIST: (shopCode: string) => `/order/log/${shopCode}`,
  },

  CATEGORY: {
    LIST: '/category/list',
    CREATE: '/category',
    UPDATE: '/category',
    DELETE: '/category',
    INDEX_UPDATE: '/category/index',
    HIDDEN: '/category/hidden',
    FIRST_ORDER: '/category/first-order',
    EXCEPT_TABLE: (shopCode: string) => `/category/except-table/${shopCode}`,
    MENUBOARD_LIST: (shopCode: string) => `/menuboard/${shopCode}`,
  },

  MENU: {
    LIST: '/menu/list',
    CREATE: '/menu',
    UPDATE: '/menu',
    DELETE: '/menu',
    INDEX_UPDATE: '/menu/index',
    HIDDEN: '/menu/hidden',
    OUT_OF_STOCK: '/menu/out-of-stock',
    EXISTING_IMAGE_LIST: (shopCode: string) =>
      `/menu/image/existing/list/${shopCode}`,
    SAMPLE_IMAGE_LIST: '/menu/image/sample/list',
  },

  SHOP: {
    CREATE: '/shop',
    DETAIL: (shopCode: string) => `/shop/${shopCode}`,
    LIST: '/shop/list',
    SETTING: '/shop/setting',
    THEME_MENU: (shopCode: string) => `/shop/theme/menu/${shopCode}`,
    THEME_PAGE: (shopCode: string) => `/shop/theme/page/${shopCode}`,
    THEME_PAGE_UPDATE: () => `/shop/theme/page`,
  },

  TABLE: {
    GROUP_LIST: (shopCode: string) => `/table-group/${shopCode}`,
    GROUP_CREATE: '/table-group',
    GROUP_UPDATE: '/table-group',
    GROUP_DELETE: '/table-group',
    CREATE: '/table',
    UPDATE: '/table',
    DELETE: '/table',
  },

  DEVICE: {
    SHOP: (shopCode: string) => `/device/${shopCode}`,
    LIST: (shopCode: string) => `/device/list/${shopCode}`,
    LIST_PAGE: (shopCode: string) => `/device/list/page/${shopCode}`,
    CONTROL: (shopCode: string, deviceControlType: string) =>
      `/device/control/${shopCode}/${deviceControlType}`,
  },

  SSE: {
    CONNECT_DEVICE: '/sse/connect/device',
  },

  NOTICE: {
    LIST: '/notice/list',
  },

  SALES: {
    SUMMARY: (shopCode: string) => `/sales/summary/${shopCode}`,
    ORDER_HISTORY: (shopCode: string) => `/sales/order-history/${shopCode}`,
    CARD_APPROVAL_HISTORY: (shopCode: string) =>
      `/sales/card-approval/${shopCode}`,
    MENU_SALES_SUMMARY: (shopCode: string) =>
      `/sales/menu-sales-summary/${shopCode}`,
  },

  PAYMENT: {
    PAYMENT: '/payment',
    APPROVAL_METHOD_CODE: (paymentMethodCode: string) =>
      `/payment/approval/${paymentMethodCode}`,
  },

  ADMIN: {
    SHOP: '/admin/shop',
    SHOP_LIST: '/admin/shop/list',
    SHOP_DETAIL: (shopCode: string) => `/admin/shop/${shopCode}`,
    MEMBER: '/admin/member',
  },
} as const;
