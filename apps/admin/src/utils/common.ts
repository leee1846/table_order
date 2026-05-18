import { useAuthStore } from '@/stores/useAuthStore';

/**
 * SHOP(사장님) 권한 여부
 * 추후 제거 예정
 *  */
export const isShopRole = (): boolean => {
  const role = useAuthStore.getState().tokenPayload?.role;
  return role === 'SHOP';
};
