import { useCallback } from 'react';
import { useToastStore, type ToastPosition } from '../stores/toastStore';

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  const toast = useCallback(
    (
      message: string,
      options?: {
        position?: ToastPosition;
        duration?: number;
      }
    ) => {
      addToast({
        message,
        position: options?.position,
        duration: options?.duration,
      });
    },
    [addToast]
  );

  return toast;
};
