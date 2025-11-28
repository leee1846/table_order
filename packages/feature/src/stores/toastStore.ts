import { create } from 'zustand';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-center';

export interface Toast {
  message: string;
  position?: ToastPosition;
  duration?: number;
}

interface ToastStore {
  toast: Toast | null;
  defaultPosition: ToastPosition;
  removeTimer: ReturnType<typeof setTimeout> | null; // 타이머 ID를 저장하는 속성
  setDefaultPosition: (position: ToastPosition) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toast: null,
  defaultPosition: 'top-center',
  removeTimer: null,
  setDefaultPosition: (position) => {
    set({ defaultPosition: position });
  },
  addToast: (toastConfig) => {
    const state = get();
    // 기존 타이머가 있으면 취소
    if (state.removeTimer) {
      clearTimeout(state.removeTimer);
    }

    const newToast: Toast = {
      ...toastConfig,
      position: toastConfig.position || state.defaultPosition,
    };

    set({ toast: newToast });

    // 자동 제거
    const duration = toastConfig.duration ?? 3000;
    if (duration > 0) {
      const timer = setTimeout(() => {
        get().removeToast();
      }, duration);
      set({ removeTimer: timer });
    } else {
      set({ removeTimer: null });
    }
  },
  removeToast: () => {
    const state = get();
    if (state.removeTimer) {
      clearTimeout(state.removeTimer);
    }
    set({ toast: null, removeTimer: null });
  },
}));
