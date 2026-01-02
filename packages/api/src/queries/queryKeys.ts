import { TAppVersionType } from '../types/common';

export const queryKeys = {
  common: {
    all: ['common'] as const,
    holidays: () => [...queryKeys.common.all, 'holidays'] as const,
    latestVersion: (type: TAppVersionType) =>
      [...queryKeys.common.all, 'latestVersion', type] as const,
  },

  shop: {
    all: ['shop'] as const,
    detail: (shopCode: string) =>
      [...queryKeys.shop.all, 'detail', shopCode] as const,
    /** 상점 리스트 조회 */
    list: () => [...queryKeys.shop.all, 'list'] as const,
    themeMenu: (shopCode: string) =>
      [...queryKeys.shop.all, 'themeMenu', shopCode] as const,
    themePage: (shopCode: string) =>
      [...queryKeys.shop.all, 'themePage', shopCode] as const,
  },

  category: {
    all: ['category'] as const,
    /** 카테고리 리스트 조회 */
    list: () => [...queryKeys.category.all, 'list'] as const,
    /** 카테고리별 테이블 블랙리스트 조회 */
    exceptTable: (shopCode: string, categorySeq: number | string) =>
      [
        ...queryKeys.category.all,
        'exceptTable',
        shopCode,
        categorySeq,
      ] as const,
    /** 메뉴 목록을 포함하는 모든 카테고리 목록 조회 */
    menuboardList: (shopCode: string, tableNumber: string) =>
      [
        ...queryKeys.category.all,
        'menuboardList',
        shopCode,
        tableNumber,
      ] as const,
  },

  menu: {
    all: ['menu'] as const,
    /** 메뉴 리스트 조회 */
    list: (categorySeq?: number | string) =>
      [...queryKeys.menu.all, 'list', categorySeq ?? 'all'] as const,
  },

  orders: {
    all: ['orders'] as const,
    /** 주문 리스트 조회 */
    list: () => [...queryKeys.orders.all, 'list'] as const,
    /** 테이블 주문 내역 조회 */
    tableOrderHistories: (shopCode: string, tableNumber: string) =>
      [
        ...queryKeys.orders.all,
        'tableOrderHistories',
        shopCode,
        tableNumber,
      ] as const,
    /** 현재 테이블 목록 조회 */
    currentTableList: (shopCode: string) =>
      [...queryKeys.orders.all, 'currentTableList', shopCode] as const,
    /** 주문 로그 리스트 조회 (페이징) */
    orderLogList: (shopCode: string, pageNumber: number, pageSize: number) =>
      [
        ...queryKeys.orders.all,
        'orderLogList',
        shopCode,
        pageNumber,
        pageSize,
      ] as const,
  },

  auth: {
    all: ['auth'] as const,
    /** 재사용 정보 조회 */
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  table: {
    all: ['table'] as const,
    /** 테이블 그룹 리스트 조회 */
    groupList: (shopCode: string) =>
      [...queryKeys.table.all, 'groupList', shopCode] as const,
  },

  device: {
    all: ['device'] as const,
    /** 디바이스 상세 조회 */
    detail: (shopCode: string, androidId: string) =>
      [...queryKeys.device.all, 'detail', shopCode, androidId] as const,
    /** 디바이스 리스트 조회 */
    list: (shopCode: string) =>
      [...queryKeys.device.all, 'list', shopCode] as const,
    /** 디바이스 리스트 조회 (페이징) */
    listWithPagination: (
      shopCode: string,
      pageNumber: number,
      pageSize: number
    ) =>
      [
        ...queryKeys.device.all,
        'listWithPagination',
        shopCode,
        pageNumber,
        pageSize,
      ] as const,
  },

  notice: {
    all: ['notice'] as const,
    /** 공지사항 목록 조회 */
    list: (page?: number, pageSize?: number) =>
      [...queryKeys.notice.all, 'list', page ?? 1, pageSize ?? 20] as const,
  },

  sales: {
    all: ['sales'] as const,
    /** 매출 요약 조회 */
    summary: (shopCode: string, startDate: string, endDate: string) =>
      [
        ...queryKeys.sales.all,
        'summary',
        shopCode,
        startDate,
        endDate,
      ] as const,
    /** 메뉴 판매 집계 조회 */
    menuSalesSummary: (shopCode: string, startDate: string, endDate: string) =>
      [
        ...queryKeys.sales.all,
        'menuSalesSummary',
        shopCode,
        startDate,
        endDate,
      ] as const,
    /** 주문 내역 조회 */
    orderHistory: (
      shopCode: string,
      startDate: string,
      endDate: string,
      pageNumber: number,
      pageSize: number
    ) =>
      [
        ...queryKeys.sales.all,
        'orderHistory',
        shopCode,
        startDate,
        endDate,
        pageNumber,
        pageSize,
      ] as const,
    /** 카드 승인 내역 조회 */
    cardApprovalHistory: (
      shopCode: string,
      cardCode: string | undefined,
      startDate: string,
      endDate: string,
      pageNumber: number,
      pageSize: number
    ) =>
      [
        ...queryKeys.sales.all,
        'cardApprovalHistory',
        shopCode,
        cardCode ?? 'all',
        startDate,
        endDate,
        pageNumber,
        pageSize,
      ] as const,
  },
} as const;
