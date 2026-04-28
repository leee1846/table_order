import styled from '@emotion/styled';
import { Typography, Upload, Modal } from 'antd';
import type { CSSProperties } from 'react';

const { Text } = Typography;

export const modalStyles = {
  header: {
    backgroundColor: '#1d2a6d',
    padding: '20px 24px',
    margin: 0,
    borderRadius: '8px 8px 0 0',
  } as CSSProperties,
  content: { padding: 0, borderRadius: '8px' } as CSSProperties,
  body: { padding: '32px 24px' } as CSSProperties,
};

export const StyledModal = styled(Modal)`
  .ant-modal-container,
  .ant-modal-content {
    padding: 0 !important;
  }
`;

export const ModalTitle = styled.span`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ShopInfoContainer = styled.div`
  margin-bottom: 24px;
`;

export const ShopCodeText = styled(Text)`
  font-size: 15px;
`;

export const ShopCodeHighlight = styled(Text)`
  color: #1d2a6d;
`;

export const InfoBanner = styled.div`
  background-color: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const InfoIconWrapper = styled.div`
  color: #1677ff;
  margin-top: 4px;
`;

export const InfoList = styled.ul`
  margin: 0;
  padding-left: 5px;
  color: #0958d9;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledDragger = styled(Upload.Dragger)`
  padding: 24px 0;

  .ant-upload-drag-icon .anticon {
    color: #1d2a6d;
  }
  .ant-upload-text {
    color: #262626 !important;
    font-weight: 500;
  }
  .ant-upload-hint {
    color: #8c8c8c !important;
  }
`;
