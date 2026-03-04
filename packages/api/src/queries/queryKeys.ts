import { TAppType } from '../types/app';
import type { THistoryCode } from '../types/admin';

export const queryKeys = {
  common: {
    all: ['common'] as const,
    holidays: () => [...queryKeys.common.all, 'holidays'] as const,
  },

  app: {
    all: ['app'] as const,
    latestVersion: (appType: TAppType) =>
      [...queryKeys.app.all, 'latestVersion', appType] as const,
    versionList: (pageNumber: number, pageSize: number, searchWord: string) =>
      [
        ...queryKeys.app.all,
        'versionList',
        pageNumber,
        pageSize,
        searchWord,
      ] as const,
    versionDetail: (appVersionSeq: number) =>
      [...queryKeys.app.all, 'versionDetail', appVersionSeq] as const,
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
    /** 기존 메뉴 이미지 목록 조회 */
    existingImageList: (shopCode: string) =>
      [...queryKeys.menu.all, 'existingImageList', shopCode] as const,
    /** 추천 메뉴 이미지 목록 조회 */
    sampleImageList: () => [...queryKeys.menu.all, 'sampleImageList'] as const,
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
    /** 공지사항 상세 조회 */
    detail: (noticeSeq: number) =>
      [...queryKeys.notice.all, 'detail', noticeSeq] as const,
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
    /** 당일 매출 내역 조회 */
    oneDaySales: (shopCode: string, saleDate: string, paymentType?: string) =>
      [
        ...queryKeys.sales.all,
        'oneDaySales',
        shopCode,
        saleDate,
        paymentType ?? 'all',
      ] as const,
    /** 일별 매출 내역 조회 */
    dailySales: (shopCode: string, startDate: string, endDate: string) =>
      [
        ...queryKeys.sales.all,
        'dailySales',
        shopCode,
        startDate,
        endDate,
      ] as const,
    /** 시간대별 매출 조회 */
    hourlySales: (shopCode: string, startDate: string, endDate: string) =>
      [
        ...queryKeys.sales.all,
        'hourlySales',
        shopCode,
        startDate,
        endDate,
      ] as const,
    /** 메뉴별 매출 내역 조회 */
    menuSalesHistory: (shopCode: string, startDate: string, endDate: string) =>
      [
        ...queryKeys.sales.all,
        'menuSalesHistory',
        shopCode,
        startDate,
        endDate,
      ] as const,
    /** 달력 매출 내역 조회 */
    calendarSales: (shopCode: string, yearMonth: string) =>
      [...queryKeys.sales.all, 'calendarSales', shopCode, yearMonth] as const,
    /** 메뉴별 매출 조회 (기간) */
  },

  admin: {
    all: ['admin'] as const,
    shopList: (pageNumber: number, pageSize: number, searchWord: string) =>
      [
        ...queryKeys.admin.all,
        'shopList',
        pageNumber,
        pageSize,
        searchWord,
      ] as const,
    shopDetail: (shopCode: string) =>
      [...queryKeys.admin.all, 'shopDetail', shopCode] as const,
    member: (memberId: string) =>
      [...queryKeys.admin.all, 'member', memberId] as const,
    memberList: (pageNumber: number, pageSize: number, searchWord: string) =>
      [
        ...queryKeys.admin.all,
        'memberList',
        pageNumber,
        pageSize,
        searchWord,
      ] as const,
    changeHistoryList: (historyCode: THistoryCode, key: string) =>
      [...queryKeys.admin.all, 'changeHistoryList', historyCode, key] as const,
  },
} as const;
