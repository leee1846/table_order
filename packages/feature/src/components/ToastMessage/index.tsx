'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToastStore, type ToastPosition } from '../../stores/toastStore';
import { ToastItem } from './ToastItem';
import { ToastContainerWrapper } from './toastMessage.styles';

interface ToastMessageProps {
  position?: ToastPosition;
}

//실제 로직
const ToastContainer = ({ position }: ToastMessageProps) => {
  const toast = useToastStore((state) => state.toast);
  const setDefaultPosition = useToastStore((state) => state.setDefaultPosition);
  const removeToast = useToastStore((state) => state.removeToast);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (position) {
      setDefaultPosition(position);
    }
  }, [position, setDefaultPosition]);

  if (!mounted) {
    return null;
  }

  // 토스트가 없으면 렌더링하지 않음
  if (!toast) {
    return null;
  }

  const toastPosition = toast.position || position || 'top-center';

  const container = typeof document !== 'undefined' ? document.body : null;

  if (!container) {
    return null;
  }

  return createPortal(
    <ToastContainerWrapper position={toastPosition} className="toast-container">
      <ToastItem toast={toast} onRemove={() => removeToast()} />
    </ToastContainerWrapper>,
    container
  );
};

/**
 * Toast 메시지 시스템의 루트 컴포넌트
 *
 * 앱의 최상위 레벨에 한 번만 마운트하면 됩니다.
 * 이 컴포넌트를 마운트하면 전역 toast 함수와 useToast 훅을 사용할 수 있습니다.
 *
 * @param {ToastMessageProps} props - 컴포넌트 props
 * @param {ToastPosition} [props.position='top-center'] - Toast가 표시될 위치
 *   - 'top-left' | 'top-center' | 'top-right'
 *   - 'bottom-left' | 'bottom-center' | 'bottom-right'
 *
 * @example
 * ```tsx
 * import { ToastMessage } from '@repo/feature/components';
 * import { useToast } from '@repo/feature/hooks';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourAppContent />
 *       <ToastMessage position="top-right" />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 컴포넌트 내에서 사용
 * import { useToast } from '@repo/feature/hooks';
 *
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleSave = () => {
 *     toast('저장되었습니다');
 *   };
 *
 *   return <button onClick={handleSave}>저장</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 컴포넌트 외부에서 사용 (예: API 유틸리티)
 * import { toast } from '@repo/feature/utils';
 *
 * export async function apiCall() {
 *   try {
 *     const result = await fetch('/api/data');
 *     toast('데이터를 불러왔습니다');
 *     return result;
 *   } catch (error) {
 *     toast('오류가 발생했습니다', {
 *       position: 'bottom-right',
 *       duration: 5000
 *     });
 *     throw error;
 *   }
 * }
 * ```
 */
export const ToastMessage = ({
  position = 'top-center',
}: ToastMessageProps) => {
  return <ToastContainer position={position} />;
};
