import { App } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import React from 'react';

interface ShowConfirmProps {
  title: string;
  targetName?: string;
  itemName?: string;
  okText?: string;
  content?: React.ReactNode;
  onConfirm: () => void;
}

/**
 * 프로젝트 테마에 맞는 커스텀 확인 모달을 표시하는 훅
 * @returns { showConfirm } - 확인 모달을 여는 함수
 */
export const useConfirmDialog = () => {
  const { modal } = App.useApp();

  const showConfirm = ({
    title,
    targetName,
    itemName,
    content,
    okText,
    onConfirm,
  }: ShowConfirmProps) => {
    modal.confirm({
      title: <strong>{title}</strong>,
      icon: <ExclamationCircleFilled style={{ color: '#1d2a6d' }} />,
      content: content || (
        <div style={{ marginTop: '16px' }}>
          <style>
            {`
              .custom-cancel-btn:hover,
              .custom-cancel-btn:focus {
                color: #1d2a6d !important;
                border-color: #1d2a6d !important;
              }
            `}
          </style>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            {targetName}{' '}
            <strong style={{ color: '#d4380d' }}>`{itemName}`</strong>
            을(를) 정말 삭제하시겠습니까?
            <br />
            <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
              삭제된 데이터는 복구할 수 없습니다.
            </span>
          </p>
        </div>
      ),
      okText: okText || '삭제',
      cancelText: '취소',
      cancelButtonProps: {
        className: 'custom-cancel-btn',
      },
      okButtonProps: {
        style: {
          backgroundColor: '#1d2a6d',
          borderColor: '#1d2a6d',
          color: '#fff',
        },
      },
      onOk: onConfirm,
    });
  };

  return { showConfirm };
};
