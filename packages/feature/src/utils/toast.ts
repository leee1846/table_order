import { useToastStore, type ToastPosition } from '../stores/toastStore';

export const toast = (
  message: string,
  options?: {
    position?: ToastPosition;
    duration?: number;
  }
) => {
  useToastStore.getState().addToast({
    message,
    position: options?.position,
    duration: options?.duration,
  });
};
