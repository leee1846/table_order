export const queryKeys = {
  shop: {
    all: ['shop'] as const,
    /** 상점 리스트 조회 */
    list: () => [...queryKeys.shop.all, 'list'] as const,
  },

  category: {
    all: ['category'] as const,
    /** 카테고리 리스트 조회 */
    list: () => [...queryKeys.category.all, 'list'] as const,
    /** 메뉴 목록을 포함하는 모든 카테고리 목록 조회 */
    menuboardList: (shopCode: string, tableNumber: number) =>
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
    tableOrderHistories: (shopCode: string, tableNumber: number) =>
      [
        ...queryKeys.orders.all,
        'tableOrderHistories',
        shopCode,
        tableNumber,
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
} as const;
