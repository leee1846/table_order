'use client';

import { Global } from '@emotion/react';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { toastMessageStyles } from './toastMessage.styles';
import type { ComponentType } from 'react';

type ToastMessageProps = Omit<ToasterProps, 'position'> & {
  position?: ToasterProps['position'];
};

const SonnerComponent = Sonner as ComponentType<ToasterProps>;

export const ToastMessage = ({
  position = 'top-center',
  ...props
}: ToastMessageProps) => {
  return (
    <>
      <Global styles={toastMessageStyles} />
      <SonnerComponent
        theme="light"
        className="toaster"
        position={position}
        toastOptions={{
          classNames: {
            toast: 'toast',
            description: 'description',
          },
        }}
        {...props}
      />
    </>
  );
};
