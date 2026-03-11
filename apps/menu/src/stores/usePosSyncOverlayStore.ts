import { create } from '@repo/feature/zustand';

interface IPosSyncOverlayStore {
  /** POS 동기화 전체 화면 오버레이 표시 여부 */
  isVisible: boolean;
  /** 오버레이 표시 (POS_SYNC_START 수신 시) */
  show: () => void;
  /** 오버레이 숨김 (POS_SYNC_END 수신 시) */
  hide: () => void;
}

/**
 * POS 동기화 중 전체 화면 오버레이 표시 상태를 관리하는 스토어
 *
 * - SSE POS_SYNC_START 수신 시 show(), POS_SYNC_END 수신 시 hide() 호출
 * - 모달/다이얼로그보다 위에 노출되는 전용 오버레이 제어용
 */
export const usePosSyncOverlayStore = create<IPosSyncOverlayStore>((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
}));
