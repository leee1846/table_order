import type { THistoryCode } from '../types/admin';

/**
 * API 엔드포인트 상수들을 정의합니다.
 */
export const ENDPOINTS = {
  COMMON: {
    HOLIDAYS: '/holidays',
    POS_SYNC_STATUS: (shopCode: string) => `/pos/sync/status/${shopCode}`,
  },

  APP: {
    LATEST_VERSION: (type: string) => `/app/version/latest/${type}`,
    VERSION_LIST: (type: string) => `/app/version/list/${type}`,
    VERSION: '/app/version',
    APP_VERSION_FILE: (appVersionSeq: number) =>
      `/app/version/file/${appVersionSeq}`,
  },

  AUTH: {
    LOGIN: '/login',
    TOKEN_REFRESH: '/token/refresh',
    LOGIN_MENUBOARD_ADMIN: '/login/menuboard',
    LOGIN_SALES: '/login/sales',
    LOGIN_QR: '/login/qr',
  },

  MEMBER: {
    PASSWORD: '/member/password',
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
    ORDER_ONBOARDING_TEST: (shopCode: string) =>
      `/order/on-boarding/test/${shopCode}`,
    ORDER_POS_CALLBACK_CHECK: (shopCode: string) =>
      `/order/pos-callback-check/${shopCode}`,
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
    TRANSLATION: (shopCode: string) => `/menu/translation/${shopCode}`,
    EXISTING_IMAGE_LIST: (shopCode: string) =>
      `/menu/image/existing/list/${shopCode}`,
    SAMPLE_IMAGE_LIST: '/menu/image/sample/list',
    SEARCH: '/menus',
    POS_EXCEL: (shopCode: string) => `/menu/bulk/pos-excel/${shopCode}`,
    IMAGE_ZIP: (shopCode: string) => `/menu/bulk/images/${shopCode}`,
    IMAGE_LIST: (shopCode: string) => `/menu/bulk/image-list/${shopCode}`,
    POS_EXCEL_BUNDLE: (shopCode: string) =>
      `/menu/bulk/pos-excel-bundle/${shopCode}`,
    REPLACE_MAIN_IMAGE: (menuSeq: number) => `/menu/bulk/image/${menuSeq}`,
    AD_FILE: (shopCode: string) => `/menu/ad/file/${shopCode}`,
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
    TABLE_OCCUPIED_CHECK: (shopCode: string, tableNumber: string) =>
      `/device/${shopCode}/table/${tableNumber}`,
  },

  SSE: {
    CONNECT_DEVICE: '/sse/connect/device',
    HEARTBEAT_ACK: '/sse/heartbeat-ack',
  },

  NOTICE: {
    NOTICE: '/notice',
    LIST: '/notice/list',
    DETAIL: (noticeSeq: number) => `/notice/${noticeSeq}`,
    VIEW: (noticeSeq: number) => `/notice/${noticeSeq}/view`,
  },

  SALES: {
    SUMMARY: (shopCode: string) => `/sales/summary/${shopCode}`,
    ORDER_HISTORY: (shopCode: string) => `/sales/order-history/${shopCode}`,
    CARD_APPROVAL_HISTORY: (shopCode: string) =>
      `/sales/card-approval/${shopCode}`,
    MENU_SALES_SUMMARY: (shopCode: string) =>
      `/sales/menu-sales-summary/${shopCode}`,
    MENU_SALES_HISTORY: (shopCode: string) =>
      `/sales/menu-sales-history/${shopCode}`,
    ONE_DAY_SALES: (shopCode: string) => `/sales/one-day-sales/${shopCode}`,
    DAILY_SALES: (shopCode: string) => `/sales/daily-sales/${shopCode}`,
    HOURLY_SALES: (shopCode: string) => `/sales/hourly-sales/${shopCode}`,
    CALENDAR_SALES: (shopCode: string) => `/sales/calendar-sales/${shopCode}`,
  },

  PAYMENT: {
    PAYMENT: '/payment',
    APPROVAL_METHOD_CODE: (paymentMethodCode: string) =>
      `/payment/approval/${paymentMethodCode}`,
    CANCEL_METHOD_CODE: (paymentMethodCode: string) =>
      `/payment/cancel/${paymentMethodCode}`,
  },

  ADMIN: {
    SHOP: '/admin/shop',
    SHOP_LIST: '/admin/shop/list',
    SHOP_DETAIL: (shopCode: string) => `/admin/shop/${shopCode}`,
    MEMBER: '/admin/member',
    MEMBER_LIST: '/admin/member/list',
    MEMBER_PASSWORD_RESET: `/admin/member/password/reset`,
    CHANGE_HISTORY_LIST: (historyCode: THistoryCode) =>
      `/admin/history/${historyCode}`,
  },

  MENU_GROUP: {
    LIST: () => `/menu-groups`,
    CREATE: `/menu-groups`,
    UPDATE: (menuGroupSeq: string | number) => `/menu-groups/${menuGroupSeq}`,
  },

  STORE_GROUP: {
    LIST: '/store-groups',
    CREATE: '/store-groups',
    UPDATE: (storeGroupSeq: string | number) =>
      `/store-groups/${storeGroupSeq}`,
    DETAIL: (id: string | number) => `/store-groups/${id}`, // TODO: 실제 상세 API 경로에 맞춰 수정하세요.
    MEMBERS: (storeGroupSeq: string | number) =>
      `/store-groups/${storeGroupSeq}/stores`,
    STORES_BY_GROUPS: '/store-groups/stores',
    EXCEL_TEMPLATE: '/store-groups/excel-template',
  },
  STORE: {
    LIST: '/stores', // TODO: 실제 API 경로에 맞게 수정하세요 (예: /stores 또는 /store/list)
    SEARCH: '/stores',
    CAMPAIGN_STATUS: (shopSeq: number) => `/stores/${shopSeq}/campaign-status`,
    TOGGLE_AD_TYPE_EXCLUSION: (
      shopSeq: number,
      campaignSeq: number,
      adType: string
    ) =>
      `/stores/${shopSeq}/campaigns/${campaignSeq}/ad-types/${adType}/exclusion`,
  },

  CAMPAIGN: {
    LIST: '/campaigns',
    DETAIL: (campaignSeq: number | string) => `/campaigns/${campaignSeq}`,
    CREATE: '/campaigns',
    UPDATE: (campaignSeq: number | string) => `/campaigns/${campaignSeq}`,
    COPY: (campaignSeq: number | string) => `/campaigns/${campaignSeq}`,
    ACTIVE: '/campaigns/active',
  },
} as const;
