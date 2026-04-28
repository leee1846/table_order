import styled from '@emotion/styled';
import { Typography, Card, Modal } from 'antd';

const { Text } = Typography;

export const modalStyles = {
  header: {
    backgroundColor: '#1d2a6d',
    padding: '20px 24px',
    margin: 0,
    borderRadius: '8px 8px 0 0',
  },
  container: { padding: 0 },
  body: { padding: '32px 24px', maxHeight: '70vh', overflowY: 'auto' },
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

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ShopCodeText = styled(Text)`
  font-size: 15px;
`;

export const ShopCodeHighlight = styled(Text)`
  color: #1d2a6d;
`;

export const StatsText = styled(Text)`
  font-size: 14px;
`;

export const InfoBanner = styled.div`
  background-color: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoText = styled(Text)`
  color: #0958d9;
  font-size: 13px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
`;

export const StyledCard = styled(Card)<{ isDragging?: boolean }>`
  border-color: ${({ isDragging }) => (isDragging ? '#1677ff' : undefined)};
  background-color: ${({ isDragging }) => (isDragging ? '#e6f4ff' : undefined)};
  border-width: ${({ isDragging }) => (isDragging ? '2px' : '1px')};
  border-style: ${({ isDragging }) => (isDragging ? 'dashed' : 'solid')};
  transition: all 0.2s;
`;

export const ImageWrapper = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
`;

export const TextWrapper = styled.div`
  line-height: 1.4;
`;

export const CategoryName = styled(Text)`
  font-size: 12px;
`;

export const MenuName = styled(Text)`
  font-size: 13px;
`;

export const EmptyImageText = styled(Text)`
  font-size: 12px;
`;
