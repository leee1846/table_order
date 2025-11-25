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
  /**
   * 카테고리 관련 쿼리 키
   */
  category: {
    all: ['category'] as const,
    /**
     * 카테고리 리스트 조회
     */
    list: () => [...queryKeys.category.all, 'list'] as const,
  },

  /**
   * 메뉴 관련 쿼리 키
   */
  menu: {
    all: ['menu'] as const,
    /**
     * 메뉴 리스트 조회
     */
    list: () => [...queryKeys.menu.all, 'list'] as const,
  },

  /**
   * 주문 관련 쿼리 키
   */
  orders: {
    /**
     * 주문 리스트 조회
     */
    list: () => ['orders', 'list'] as const,
  },

  /**
   * 인증 관련 쿼리 키
   */
  auth: {
    /**
     * 현재 사용자 정보 조회
     */
    me: () => ['auth', 'me'] as const,
  },
} as const;
