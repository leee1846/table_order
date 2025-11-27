'use client';

import { useEffect } from 'react';
import { Global } from '@emotion/react';
import {
  ToastProvider,
  useToastContext,
  ToastPosition,
} from '../../contexts/ToastContext';
import { ToastItem } from './ToastItem';
import {
  toastMessageStyles,
  ToastContainerWrapper,
} from './toastMessage.styles';
import { setToastInstance } from './toast';
import { useToast } from '../../hooks/useToast';

interface ToastMessageProps {
  position?: ToastPosition;
  visibleToasts?: number;
}

const ToastContainer = ({ position, visibleToasts }: ToastMessageProps) => {
  const { toasts, removeToast } = useToastContext();
  const toast = useToast();

  useEffect(() => {
    setToastInstance(toast, removeToast);
  }, [toast, removeToast]);

  const displayedToasts = visibleToasts ? toasts.slice(-visibleToasts) : toasts;

  if (displayedToasts.length === 0) {
    return null;
  }

  // position별로 toast 그룹화
  const toastsByPosition = displayedToasts.reduce(
    (acc, toastItem) => {
      const toastPosition = toastItem.position || position || 'top-center';
      if (!acc[toastPosition]) {
        acc[toastPosition] = [];
      }
      acc[toastPosition].push(toastItem);
      return acc;
    },
    {} as Record<ToastPosition, typeof displayedToasts>
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(([pos, positionToasts]) => (
        <ToastContainerWrapper
          key={pos}
          position={pos as ToastPosition}
          className="toaster"
        >
          {positionToasts.map((toastItem) => (
            <ToastItem
              key={toastItem.id}
              toast={toastItem}
              onRemove={removeToast}
            />
          ))}
        </ToastContainerWrapper>
      ))}
    </>
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
 * @param {number} [props.visibleToasts] - 동시에 표시할 최대 Toast 개수. 지정하지 않으면 제한 없음
 *
 * @example
 * ```tsx
 * import { ToastMessage } from '@nexa/ui';
 * import { useToast } from '@nexa/ui';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourAppContent />
 *       <ToastMessage position="top-right" visibleToasts={3} />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 컴포넌트 내에서 사용
 * import { useToast } from '@nexa/ui';
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
 * import { toast } from '@nexa/ui';
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
  visibleToasts,
}: ToastMessageProps) => {
  return (
    <ToastProvider position={position} visibleToasts={visibleToasts}>
      <Global styles={toastMessageStyles} />
      <ToastContainer position={position} visibleToasts={visibleToasts} />
    </ToastProvider>
  );
};
