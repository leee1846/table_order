import { create } from '@repo/feature/zustand';
import type { ITokenPayload } from '@repo/api/types';
import { getAccessToken } from '@repo/api/auth';
import { decodeJwtToken } from '@repo/util/function';
import storage from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/keys';

export interface IAuthStore {
  /** 디코딩된 토큰 페이로드 */
  tokenPayload: ITokenPayload | null;
  /** shopSeq로 매칭한 shopCode */
  shopCode: string | null;
  /** shopSeq */
  shopSeq: number | null;
  /** 토큰 정보 초기화 및 갱신 */
  refreshTokenInfo: () => void;
  /** 데이터 초기화 */
  clearAuth: () => void;
}

/**
 * 인증 정보를 관리하는 Store
 * - 토큰 디코딩 결과를 캐싱
 * - shopSeq로 shopCode 매칭
 */
export const useAuthStore = create<IAuthStore>((set, get) => {
  // 초기화: localStorage에서 토큰 읽기 및 디코딩
  const initializeAuth = (): {
    tokenPayload: ITokenPayload | null;
    shopCode: string | null;
    shopSeq: number | null;
  } => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return { tokenPayload: null, shopCode: null, shopSeq: null };
    }

    const payload = decodeJwtToken<ITokenPayload>(accessToken);
    if (!payload) {
      return { tokenPayload: null, shopCode: null, shopSeq: null };
    }

    // shopSeq는 토큰에서 가져옴
    const shopSeq = payload.shopSeq;

    // shopCode는 매장 목록에서 찾아야 하므로 null로 초기화
    // 실제 shopCode는 useAuth 훅에서 매칭
    return { tokenPayload: payload, shopCode: null, shopSeq };
  };

  const initial = initializeAuth();

  return {
    tokenPayload: initial.tokenPayload,
    shopCode: initial.shopCode,
    shopSeq: initial.shopSeq,
    refreshTokenInfo: () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        set({ tokenPayload: null, shopCode: null, shopSeq: null });
        storage.remove(STORAGE_KEYS.AUTH);
        return;
      }

      const payload = decodeJwtToken<ITokenPayload>(accessToken);

      if (!payload) {
        set({ tokenPayload: null, shopCode: null, shopSeq: null });
        storage.remove(STORAGE_KEYS.AUTH);
        return;
      }

      // shopCode는 별도로 매칭해야 하므로 여기서는 shopSeq만 업데이트
      set({
        tokenPayload: payload,
        shopSeq: payload.shopSeq,
        // shopCode는 useAuth 훅에서 업데이트
      });
    },
    clearAuth: () => {
      storage.remove(STORAGE_KEYS.AUTH);
      set({ tokenPayload: null, shopCode: null, shopSeq: null });
    },
  };
});
