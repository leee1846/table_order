/**
 * React Query 쿼리 키를 중앙에서 관리하는 파일
 * 모든 쿼리 키는 이 파일을 통해 접근해야 합니다.
 *
 * @example
 * ```ts
 * import { queryKeys } from './queryKeys';
 *
 * // 쿼리 키 사용
 * queryKey: queryKeys.category.list(shopSeq)
 *
 * // 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
 * ```
 */

export const queryKeys = {
  category: {
    all: ['category'] as const,
    /** 카테고리 리스트 조회 */
    list: () => [...queryKeys.category.all, 'list'] as const,
  },

  menu: {
    all: ['menu'] as const,
    /** 메뉴 리스트 조회 */
    list: () => [...queryKeys.menu.all, 'list'] as const,
  },

  orders: {
    all: ['orders'] as const,
    /** 주문 리스트 조회 */
    list: () => [...queryKeys.orders.all, 'list'] as const,
  },

  auth: {
    all: ['auth'] as const,
    /** 현재 사용자 정보 조회 */
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
} as const;
