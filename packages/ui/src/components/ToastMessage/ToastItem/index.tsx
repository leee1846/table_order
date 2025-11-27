'use client';

import { useEffect, useState } from 'react';
import { Toast } from '../../../contexts/ToastContext';
import * as S from './toastItem.styles';
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 애니메이션을 위한 지연
    setTimeout(() => setIsVisible(true), 10);

    return () => {
      setIsLeaving(true);
    };
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  return (
    <S.ToastItemStyles
      onClick={handleRemove}
      isVisible={isVisible}
      isLeaving={isLeaving}
    >
      <S.ContentWrapperStyles>
        <S.MessageStyles>{toast.message}</S.MessageStyles>
      </S.ContentWrapperStyles>
    </S.ToastItemStyles>
  );
};
