import styled from '@emotion/styled';
import {
  Backdrop as BaseBackdrop,
  ModalContainer as BaseModalContainer,
} from './UploadModal.style';
import type { CSSProperties } from 'react';

export const Backdrop = styled(BaseBackdrop)`
  z-index: 100;
`;

export const ModalContainer = styled(BaseModalContainer)`
  width: 1200px;
  max-width: 90%;
  height: 70vh;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
`;

export const ContentWrapper = styled.div`
  margin: 20px 0;
  min-height: 100px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StatsText = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;


export const DragDropGuide = styled.p`
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
`;

/* export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`; */

export const ItemContainer = styled.div<{
  $isDragging?: boolean;
  $isHovered?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.8 : 1)};
  transform: ${({ $isDragging, $isHovered }) =>
    $isDragging ? 'scale(0.98)' : $isHovered ? 'scale(1.03)' : 'scale(1)'};
  box-shadow: ${({ $isDragging }) =>
    $isDragging ? '0 0 0 3px #3b82f6' : '0 0 0 0px transparent'};
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
`;

export const imageStyle: CSSProperties = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: '1px solid #e5e5e5',
};

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 120px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  color: #999;
  font-size: 12px;
`;

export const TextContainer = styled.div`
  font-size: 13px;
  color: #333;
  text-align: center;
  word-break: keep-all;
  line-height: 1.3;
  padding: 2px 0;
`;

export const CategoryName = styled.span`
  font-size: 11px;
  color: #888;
`;

export const EmptyMessage = styled.p`
  margin-top: 10px;
  color: #666;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
`;
