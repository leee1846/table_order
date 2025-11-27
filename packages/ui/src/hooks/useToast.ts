import { useCallback } from 'react';
import { useToastContext, type ToastPosition } from '../contexts/ToastContext';

export const useToast = () => {
  const { addToast } = useToastContext();

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
        duration: options?.duration || 3000,
      });
    },
    [addToast]
  );

  return toast;
};
